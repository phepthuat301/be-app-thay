import { Router } from 'express';

import { login, register } from 'controllers/auth';
import validator from 'middleware/validation/validator';

const router = Router();

router.post('/register', [validator('register')], register);
router.post('/login', [validator('login')], login);

export default router;
