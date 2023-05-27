// Start import region
import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import validators, { ValidatorType } from './auth/';
// End import region

const validatorMiddleware = (validator: ValidatorType) => {
  //! If validator is not exist, throw err
  if (!validators.hasOwnProperty(validator)) throw new Error(`'${validator}' validator is not exist`);
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      const validated = await validators[validator].validateAsync(req.body);
      req.body = validated;
      next();
    } catch (err) {
      //* Pass err to next
      //! If validation error occurs call next with HTTP 400. Otherwise HTTP 500
      if (err.isJoi) return next(createHttpError(400, { message: err.message }));
      next(createHttpError(500));
    }
  };
};

export default validatorMiddleware;
