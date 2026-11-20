import status from 'http-status';
import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import type {
  TCreateMovieInput,
  TMovieNode,
  TMovies,
  TUpdateMovieInput,
} from './movies.interface';
import { Movie } from './movies.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { MOVIE_SEARCHABLE_FIELDS } from './movie.constant';

// Convert ObjectId into a string for Map and Set operations.
const getId = (id: mongoose.Types.ObjectId | string) => id.toString();

// Validate prerequisite IDs.
const validatePrerequisites = async (
  prerequisiteIds: string[],
  currentMovieId?: string,
) => {
  if (!Array.isArray(prerequisiteIds)) {
    throw new AppError(status.BAD_REQUEST, 'Prerequisites must be an array');
  }

  if (new Set(prerequisiteIds).size !== prerequisiteIds.length) {
    throw new AppError(
      status.BAD_REQUEST,
      'Duplicate prerequisites are not allowed',
    );
  }

  for (const id of prerequisiteIds) {
    if (!mongoose.isValidObjectId(id)) {
      throw new AppError(status.BAD_REQUEST, `Invalid prerequisite ID: ${id}`);
    }

    if (currentMovieId && id === currentMovieId) {
      throw new AppError(
        status.BAD_REQUEST,
        'A movie cannot depend on itself',
        'CIRCULAR_DEPENDENCY',
      );
    }
  }

  const existingMovies = await Movie.find({
    _id: { $in: prerequisiteIds },
  }).select('_id');

  if (existingMovies.length !== prerequisiteIds.length) {
    throw new AppError(
      status.BAD_REQUEST,
      'One or more prerequisite movies do not exist',
    );
  }
};

// Build adjacency list: From movie ID to prerequisite IDs.
const buildGraph = (movies: TMovieNode[]) => {
  const graph = new Map<string, string[]>();

  for (const movie of movies) {
    graph.set(getId(movie._id), movie.prerequisites.map(getId));
  }

  return graph;
};

// Detect whether the graph contains any cycle.
const hasCycle = (graph: Map<string, string[]>) => {
  const visiting = new Set<string>();
  const visited = new Set<string>();

  const dfs = (movieId: string): boolean => {
    //  Reached a node currently in the recursion path.
    if (visiting.has(movieId)) {
      return true;
    }

    // Already completely processed.
    if (visited.has(movieId)) {
      return false;
    }

    visiting.add(movieId);

    const prerequisites = graph.get(movieId) ?? [];

    for (const prerequisiteId of prerequisites) {
      if (dfs(prerequisiteId)) {
        return true;
      }
    }

    visiting.delete(movieId);
    visited.add(movieId);

    return false;
  };

  for (const movieId of graph.keys()) {
    if (dfs(movieId)) {
      return true;
    }
  }

  return false;
};

const validateGraph = (graph: Map<string, string[]>) => {
  if (hasCycle(graph)) {
    throw new AppError(
      status.CONFLICT,
      'This dependency would create a circular dependency',
      'CIRCULAR_DEPENDENCY',
    );
  }
};

// CREATE MOVIE
const createMovieIntoDB = async (payload: TCreateMovieInput) => {
  const prerequisiteIds = payload.prerequisites ?? [];

  await validatePrerequisites(prerequisiteIds);

  const movie = new Movie({
    ...payload,
    prerequisites: prerequisiteIds,
  });

  // Check the graph before saving.
  const movies = await Movie.find().lean();

  const graph = buildGraph(movies as unknown as TMovieNode[]);

  graph.set(getId(movie._id), prerequisiteIds);

  validateGraph(graph);

  await movie.save();
  console.log("created movie =>",movie);

  return movie;
};

// GET ALL MOVIES
const getAllMoviesFromDB = async (query: Record<string, unknown>) => {
  const movieQuery = new QueryBuilder<TMovies>(
    Movie.find().populate('prerequisites', 'title releaseYear runtime watched'),
    { sort: 'releaseYear,_id', ...query }, // keep the original ordering as the default
  )
    .search(MOVIE_SEARCHABLE_FIELDS)
    .filter()
    .sort()
    .paginate()
    .fieldLimiting();

  const data = await movieQuery.modelQuery;
  const meta = await movieQuery.countTotal();

  return { meta, data };
};

const getSingleMovieFromDB = async (movieId: string) => {
  if (!mongoose.isValidObjectId(movieId)) {
    throw new AppError(status.BAD_REQUEST, 'Invalid movie ID');
  }
  const result = await Movie.findById(movieId);
  return result;
};

// UPDATE MOVIE
const updateMovieIntoDB = async (
  movieId: string,
  payload: TUpdateMovieInput,
) => {
  if (!mongoose.isValidObjectId(movieId)) {
    throw new AppError(status.BAD_REQUEST, 'Invalid movie ID');
  }

  const movie = await Movie.findById(movieId);

  if (!movie) {
    throw new AppError(status.NOT_FOUND, 'Movie not found');
  }

  if (payload.prerequisites !== undefined) {
    await validatePrerequisites(payload.prerequisites, movieId);

    const movies = await Movie.find().lean();

    const graph = buildGraph(movies as unknown as TMovieNode[]);

    // Replace this movie's existing prerequisite edges  with the proposed ones.
    graph.set(movieId, payload.prerequisites);

    validateGraph(graph);
  }

  // Only update fields supplied by the client.
  if (payload.title !== undefined) movie.title = payload.title;
  if (payload.releaseYear !== undefined) {
    movie.releaseYear = payload.releaseYear;
  }
  if (payload.runtime !== undefined) {
    movie.runtime = payload.runtime;
  }
  if (payload.watched !== undefined) {
    movie.watched = payload.watched;
  }
  if (payload.prerequisites !== undefined) {
    movie.prerequisites = payload.prerequisites.map(
      (id) => new mongoose.Types.ObjectId(id),
    );
  }

  await movie.save();

  return movie;
};

// GET REWATCH ORDER
const getRewatchOrderFromDB = async (targetMovieId: string) => {
  if (!mongoose.isValidObjectId(targetMovieId)) {
    throw new AppError(status.BAD_REQUEST, 'Invalid movie ID');
  }

  const movies = await Movie.find().lean();

  const targetMovie = movies.find(
    (movie) => getId(movie._id) === targetMovieId,
  );

  if (!targetMovie) {
    throw new AppError(status.NOT_FOUND, 'Movie not found');
  }

  const graph = buildGraph(movies as unknown as TMovieNode[]);

  // Check whether the invalid data exists in the database.
  validateGraph(graph);

  const movieMap = new Map(movies.map((movie) => [getId(movie._id), movie]));

  const visited = new Set<string>();
  const orderedMovies: typeof movies = [];

  const dfs = (movieId: string) => {
    if (visited.has(movieId)) return;

    visited.add(movieId);

    const prerequisites = graph.get(movieId) ?? [];

    for (const prerequisiteId of prerequisites) {
      dfs(prerequisiteId);
    }

    // Exclude the target movie itself.
    if (movieId !== targetMovieId) {
      const movie = movieMap.get(movieId);

      if (movie) {
        orderedMovies.push(movie);
      }
    }
  };

  dfs(targetMovieId);

  const watchedCount = orderedMovies.filter((movie) => movie.watched).length;

  const unwatchedMovies = orderedMovies.filter((movie) => !movie.watched);

  const totalRuntime = unwatchedMovies.reduce(
    (total, movie) => total + movie.runtime,
    0,
  );

  return {
    targetMovie: {
      _id: targetMovie._id,
      title: targetMovie.title,
    },
    totalPrerequisites: orderedMovies.length,
    watchedCount,
    unwatchedCount: unwatchedMovies.length,
    totalRuntime,
    movies: orderedMovies,
  };
};

export const MovieServices = {
  createMovieIntoDB,
  getAllMoviesFromDB,
  getSingleMovieFromDB,
  updateMovieIntoDB,
  getRewatchOrderFromDB,
};
