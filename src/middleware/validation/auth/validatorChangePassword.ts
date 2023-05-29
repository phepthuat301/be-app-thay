import { ConstsUser } from 'consts/ConstsUser';

import joi from 'joi';

// Minimum eight characters, at least one letter and one number:
export const changePasswordSchema = joi.object({
  password: joi.string().required().min(ConstsUser.PASSWORD_MIN_CHAR),
  passwordNew: joi.string().required().min(ConstsUser.PASSWORD_MIN_CHAR),
});
