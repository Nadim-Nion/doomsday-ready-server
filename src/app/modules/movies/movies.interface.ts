import type mongoose from 'mongoose';

export type TMovies = {
  title: string;
  releaseYear: number;
  runtime: number;
  watched: boolean;
  prerequisites: mongoose.Types.ObjectId[];
};

export type TCreateMovieInput = {
  title: string;
  releaseYear: number;
  runtime: number;
  prerequisites?: string[];
}

export type TUpdateMovieInput = {
  title?: string;
  releaseYear?: number;
  runtime?: number;
  watched?: boolean;
  prerequisites?: string[];
}

export type TMovieNode = {
  _id: mongoose.Types.ObjectId;
  title: string;
  releaseYear: number;
  runtime: number;
  watched: boolean;
  prerequisites: mongoose.Types.ObjectId[];
}