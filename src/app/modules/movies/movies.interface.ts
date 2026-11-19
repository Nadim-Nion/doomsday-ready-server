import type mongoose from 'mongoose';

export type TMovies = {
  title: string;
  releaseYear: number;
  runtime: number;
  watched: boolean;
  prerequisites: mongoose.Types.ObjectId[];
};
