import { create, deleteItem, edit, getItemList } from 'controllers/item';
import { getItemByName } from 'controllers/item';
import { Router } from 'express';
import { checkJwt } from 'middleware/checkJwt';

const router = Router();

router.post('/create', [checkJwt], create);
router.post('/edit', [checkJwt], edit);
router.delete('/delete/:id', [checkJwt], deleteItem);
router.post('/get-by-name', [checkJwt], getItemByName);
router.get('/get', [checkJwt], getItemList);

export default router;
