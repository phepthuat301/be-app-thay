import { create, getOrderByName } from 'controllers/order';
import { Router } from 'express';
import { checkJwt } from 'middleware/checkJwt';

const router = Router();

router.post('/create', [checkJwt], create);
router.post('/get-by-name', [checkJwt], getOrderByName);

export default router;
