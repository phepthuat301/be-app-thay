import { ConstsUser } from 'consts/ConstsUser';

import joi from 'joi';

// Minimum eight characters, at least one letter and one number:
export const registerSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required().min(ConstsUser.PASSWORD_MIN_CHAR),
  phone: joi
    .string()
    .regex(/^[0-9]{10}$/)
    .messages({ 'string.pattern.base': `Phone number must have 10 digits.` })
    .required(),
});
