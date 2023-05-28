import { create, edit } from 'controllers/item';
import { Router } from 'express';
import { checkJwt } from 'middleware/checkJwt';

const router = Router();

router.post('/create', [checkJwt], create);
router.post('/edit', [checkJwt], edit);

export default router;
