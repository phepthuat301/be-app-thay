import { Router } from 'express';

import auth from './auth';
import users from './users';
import customers from './customers';
import items from './items';
const router = Router();

router.use('/auth', auth);
router.use('/users', users);
router.use('/customers', customers);
router.use('/items', items);

export default router;
