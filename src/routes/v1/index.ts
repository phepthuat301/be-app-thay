import { Router } from 'express';

import auth from './auth';
import customers from './customers';
import dashboard from './dashboard';
import history from './history';
import items from './items';
import order from './order';
const router = Router();

router.use('/auth', auth);
router.use('/customers', customers);
router.use('/items', items);
router.use('/history', history);
router.use('/orders', order);
router.use('/dashboard', dashboard);
export default router;
