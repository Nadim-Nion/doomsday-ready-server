import { Types } from 'mongoose';
import { z } from 'zod';

const objectId = z.string().refine((val) => Types.ObjectId.isValid(val), {
  message: 'Invalid ObjectId',
});

const createMovieValidationSchema = z.object({
  body: z.object({
    title: z
      .string({ error: 'Title is required' })
      .trim()
      .min(1, 'Title cannot be empty'),
    releaseYear: z
      .number({ error: 'Release year is required' })
      .int('Release year must be an integer')
      .min(1888, 'Release year cannot be before 1888')
      .max(
        new Date().getFullYear() + 5,
        'Release year is too far in the future',
      ),
    runtime: z
      .number({ error: 'Runtime is required' })
      .int('Runtime must be an integer')
      .positive('Runtime must be greater than 0'),
    watched: z.boolean().default(false),
    prerequisites: z.array(objectId).default([]),
  }),
});

const updateMovieValidationSchema = z.object({
  body: createMovieValidationSchema.shape.body.partial(),
});

export const MovieValidations = {
  createMovieValidationSchema,
  updateMovieValidationSchema,
};
