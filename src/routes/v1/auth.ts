import { Router } from 'express';

import { changePassword, login, register } from 'controllers/auth';
import { checkJwt } from 'middleware/checkJwt';
// import { validatorLogin, validatorRegister, validatorChangePassword } from 'middleware/validation/auth';
import validator from 'middleware/validation/validator';

const router = Router();

router.post('/register', [validator('register')], register);
router.post('/login', [validator('login')], login);
router.post('/change-password', [checkJwt, validator('changePassword')], changePassword);

export default router;
