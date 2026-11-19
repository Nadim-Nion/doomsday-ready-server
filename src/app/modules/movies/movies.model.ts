import mongoose, { Schema } from 'mongoose';
import type { TMovies } from './movies.interface';

const movieSchema = new Schema<TMovies>(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    releaseYear: {
      type: Number,
      required: true,
      min: 1,
    },
    runtime: {
      type: Number,
      required: true,
      min: 1,
      max: 300,
    },
    watched: {
      type: Boolean,
      default: false,
    },
    prerequisites: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Movie',
      },
    ],
  },
  {
    timestamps: true,
  },
);

export const Movie = mongoose.model<TMovies>('Movie', movieSchema);
