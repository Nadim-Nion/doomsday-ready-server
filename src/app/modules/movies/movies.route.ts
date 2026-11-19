import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { MovieControllers } from './movies.controller';
import { MovieValidations } from './movies.validation';

const router = Router();

router.post(
  '/',
  validateRequest(MovieValidations.createMovieValidationSchema),
  MovieControllers.createMovie,
);
router.get('/', MovieControllers.getAllMovies);
router.patch(
  '/:id',
  validateRequest(MovieValidations.updateMovieValidationSchema),
  MovieControllers.updateMovie,
);
router.get('/:id/rewatch-order', MovieControllers.getRewatchOrder);

export const MovieRoutes = router;
