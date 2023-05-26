import { Request, Response, NextFunction } from 'express';
import { CustomError } from 'utils/response/custom-error/CustomError';
import AdminService from 'services/admin.services';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, name, phone } = req.body;
    const result = await AdminService.register(name, email, password, phone);
    res.customSuccess(200, 'Admin successfully created.', result);
  } catch (err) {
    const customError = new CustomError(400, 'Raw', 'Error', null, err);
    return next(customError);
  }
};
