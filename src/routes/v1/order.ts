import { create, getOrderByName, getOrderByUserId } from 'controllers/order';
import { refundById } from 'controllers/order/refund';
import { Router } from 'express';
import { checkJwt } from 'middleware/checkJwt';

const router = Router();

router.post('/create', [checkJwt], create);
router.post('/get-by-name', [checkJwt], getOrderByName);
router.post('/get-by-user-id', [checkJwt], getOrderByUserId);
router.post('/refund', [checkJwt], refundById);
export default router;
