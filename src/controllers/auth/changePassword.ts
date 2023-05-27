import { Request, Response, NextFunction } from 'express';

import { CustomError } from 'utils/response/custom-error/CustomError';
import AdminService from 'services/admin.services';

export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { password, passwordNew } = req.body;
    const { id } = req.jwtPayload;

    const result = await AdminService.changePassword(id, password, passwordNew);
    res.customSuccess(200, 'Password successfully changed.', result);
  } catch (err) {
    const customError = new CustomError(400, 'Raw', 'Error', null, err);
    return next(customError);
  }
};
