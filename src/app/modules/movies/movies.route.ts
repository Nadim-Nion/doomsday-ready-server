import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { MovieControllers } from './movies.controller';
import { MovieValidations } from './movies.validation';

const router = Router();

router.post(
  '/movies',
  validateRequest(MovieValidations.createMovieValidationSchema),
  MovieControllers.createMovie,
);
router.get('/movies', MovieControllers.getAllMovies);
router.patch(
  '/movies/:id',
  validateRequest(MovieValidations.updateMovieValidationSchema),
  MovieControllers.updateMovie,
);
router.get('/movies/:id/rewatch-order', MovieControllers.getRewatchOrder);

export default router;
