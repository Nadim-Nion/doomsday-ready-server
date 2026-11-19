import { Router } from 'express';
import { MovieRoutes } from '../modules/movies/movies.route';
import { UserRoutes } from '../modules/user/user.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/movies',
    route: MovieRoutes,
  },
];

/* router.use('/users', UserRoutes);
router.use('/students', StudentRoutes); */

moduleRoutes.forEach((moduleRoute) =>
  router.use(moduleRoute.path, moduleRoute.route),
);

export default router;
