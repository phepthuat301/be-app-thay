import joi from 'joi';

const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

// Minimum eight characters, at least one letter and one number:
export const loginSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required(),
});
