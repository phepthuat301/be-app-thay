
import { getListPatient, getPatientDetail, getStatistic, loginAdmin } from 'controllers/dashboard';
import { Router } from 'express';
import { checkJwt } from 'middleware/checkJwt';
import validator from 'middleware/validation/validator';

const router = Router();

router.post('/login', [validator('login')], loginAdmin);
router.get('/patient', [checkJwt], getListPatient);
router.get('/patient/:id', [checkJwt], getPatientDetail);
router.get('/statistic', [checkJwt], getStatistic);

export default router;
