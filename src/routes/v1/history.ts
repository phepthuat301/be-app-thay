import { create, deleteHistories, getHistoryByName, getHistoryByUser } from 'controllers/history';
import { Router } from 'express';
import { checkJwt } from 'middleware/checkJwt';

const router = Router();

router.post('/create', [checkJwt], create);
router.post('/get-by-name', [checkJwt], getHistoryByName);
router.post('/get-by-user', [checkJwt], getHistoryByUser);
router.post('/delete-histories', [checkJwt], deleteHistories);

export default router;
