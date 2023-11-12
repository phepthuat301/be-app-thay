import { getInfo, saveInfo } from 'controllers/customer';
import { Router } from 'express';
import { checkJwt } from 'middleware/checkJwt';

const router = Router();

router.post('/save-info', [checkJwt], saveInfo);
router.get('/info', [checkJwt], getInfo);

export default router;
