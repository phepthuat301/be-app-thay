import { Router } from 'express';

import { login, register, resetPassword, sendCode, verifyForgotPassword } from 'controllers/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', sendCode);
router.post('/verify-forgot-password', verifyForgotPassword);
router.post('/reset-password', resetPassword);

export default router;
