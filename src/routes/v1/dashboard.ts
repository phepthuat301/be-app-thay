import { getStatistics } from 'controllers/dashboard';
import { Router } from 'express';
import { checkJwt } from 'middleware/checkJwt';

const router = Router();

router.post('/statistic', [checkJwt], getStatistics);

export default router;
