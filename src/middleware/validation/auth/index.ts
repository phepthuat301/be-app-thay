// End import region

import { changePassword } from 'controllers/auth';
import { loginSchema } from './validatorLogin';
import { registerSchema } from './validatorRegister';
import { changePasswordSchema } from './validatorChangePassword';

export type ValidatorType = 'register' | 'login' | 'changePassword';

const validators = {
  register: registerSchema,
  login: loginSchema,
  changePassword: changePasswordSchema,
};

export default validators;
