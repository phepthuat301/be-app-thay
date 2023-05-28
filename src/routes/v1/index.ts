import { Router } from 'express';

import auth from './auth';
import users from './users';
import customers from './customers';
const router = Router();

router.use('/auth', auth);
router.use('/users', users);
router.use('/customers', customers);

export default router;
