import { Router } from 'express';

import { changePassword, login, register, verifyPagePassword } from 'controllers/auth';
import { checkJwt } from 'middleware/checkJwt';
// import { validatorLogin, validatorRegister, validatorChangePassword } from 'middleware/validation/auth';
import validator from 'middleware/validation/validator';
import { getAdminInfo } from 'controllers/auth/get';

const router = Router();

router.post('/register', [validator('register')], register);
router.post('/login', [validator('login')], login);

export default router;
