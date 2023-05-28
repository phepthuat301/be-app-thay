import { create, edit, getCustomerList, getCustomerListByName } from 'controllers/customer';
import { Router } from 'express';
import { checkJwt } from 'middleware/checkJwt';

const router = Router();

router.post('/create', [checkJwt], create);
router.post('/edit', [checkJwt], edit);
router.get('/list', [checkJwt], getCustomerList);
router.post('/list-by-name', [checkJwt], getCustomerListByName);

export default router;
