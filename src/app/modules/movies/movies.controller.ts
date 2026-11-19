import type { RequestHandler } from 'express';
import status from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { MovieServices } from './movies.service';

const createMovie: RequestHandler = catchAsync(async (req, res) => {
  const movie = await MovieServices.createMovieIntoDB(req.body);

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: 'Movie created successfully',
    data: movie,
  });
});

const getAllMovies: RequestHandler = catchAsync(async (req, res) => {
  const movies = await MovieServices.getAllMoviesFromDB();

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Movies retrieved successfully',
    data: movies,
  });
});

const updateMovie: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const movie = await MovieServices.updateMovieIntoDB(id as string, req.body);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Movie updated successfully',
    data: movie,
  });
});

const getRewatchOrder: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await MovieServices.getRewatchOrderFromDB(id as string);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Rewatch order retrieved successfully',
    data: result,
  });
});


export const MovieControllers = {
  createMovie,
  getAllMovies,
  updateMovie,
  getRewatchOrder,
};