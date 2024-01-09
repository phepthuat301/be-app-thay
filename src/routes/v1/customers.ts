import { getImages, getInfo, saveInfo } from 'controllers/customer';
import { updateInfo } from 'controllers/customer/update-info';
import { Router } from 'express';
import { checkJwt } from 'middleware/checkJwt';

const router = Router();

router.post('/save-info', [checkJwt], saveInfo);
router.post('/update-info', [checkJwt], updateInfo);
router.get('/info', [checkJwt], getInfo);
router.get('/images', [checkJwt], getImages);

export default router;
