
import { test } from 'controllers/test';
import { Router } from 'express';
import { checkJwt } from 'middleware/checkJwt';

const router = Router();

router.get('/', test);
export default router;
