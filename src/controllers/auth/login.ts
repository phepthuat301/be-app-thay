import { Request, Response, NextFunction } from 'express';
import { CustomError } from 'utils/response/custom-error/CustomError';
import AdminService from 'services/admin.services';

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const token = await AdminService.login(email, password);
    res.customSuccess(200, 'Admin successfully logged in.', token);
  } catch (err) {
    const customError = new CustomError(400, 'Raw', 'Error', null, err);
    return next(customError);
  }
};
