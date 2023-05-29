import { create, getHistoryByName } from 'controllers/history';
import { Router } from 'express';
import { checkJwt } from 'middleware/checkJwt';

const router = Router();

router.post('/create', [checkJwt], create);
router.post('/get-by-name', [checkJwt], getHistoryByName);

export default router;
