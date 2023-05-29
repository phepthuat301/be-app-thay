import { Router } from 'express';

import auth from './auth';
import customers from './customers';
import items from './items';
import history from './history';
import order from './order';
const router = Router();

router.use('/auth', auth);
router.use('/customers', customers);
router.use('/items', items);
router.use('/history', history);
router.use('/order', order);
export default router;
