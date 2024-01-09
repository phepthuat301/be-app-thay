import { Router } from 'express';

import { changePassword, checkUser, login, register, resetPassword} from 'controllers/auth';
import { checkJwt } from 'middleware/checkJwt';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/check-user', checkUser);
router.post('/reset-password', resetPassword);
router.post('/change-password', [checkJwt], changePassword);

export default router;
