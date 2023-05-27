import { ConstsUser } from 'consts/ConstsUser';

import joi from 'joi';
// import { PASSWORD_MIN_CHAR } from 'shared/constants/user';

const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

// Minimum eight characters, at least one letter and one number:
export const registerSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required().min(ConstsUser.PASSWORD_MIN_CHAR),
});

// export const validatorRegister = (req: Request, res: Response, next: NextFunction) => {
//   let { email, password, passwordConfirm } = req.body;
//   const errorsValidation: ErrorValidation[] = [];

//   email = !email ? '' : email;
//   password = !password ? '' : password;
//   passwordConfirm = !passwordConfirm ? '' : passwordConfirm;

//   if (!validator.isEmail(email)) {
//     errorsValidation.push({ email: 'Email is invalid' });
//   }

//   if (validator.isEmpty(email)) {
//     errorsValidation.push({ email: 'Email is required' });
//   }

//   if (validator.isEmpty(password)) {
//     errorsValidation.push({ password: 'Password is required' });
//   }

//   if (!validator.isLength(password, { min: ConstsUser.PASSWORD_MIN_CHAR })) {
//     errorsValidation.push({
//       password: `Password must be at least ${ConstsUser.PASSWORD_MIN_CHAR} characters`,
//     });
//   }

//   if (validator.isEmpty(passwordConfirm)) {
//     errorsValidation.push({ passwordConfirm: 'Confirm password is required' });
//   }

//   if (!validator.equals(password, passwordConfirm)) {
//     errorsValidation.push({ passwordConfirm: 'Passwords must match' });
//   }

//   if (errorsValidation.length !== 0) {
//     const customError = new CustomError(400, 'Validation', 'Register validation error', null, null, errorsValidation);
//     return next(customError);
//   }
//   return next();
// };
