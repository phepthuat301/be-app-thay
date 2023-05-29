import { Request, Response, NextFunction } from 'express';

import { CustomError } from 'utils/response/custom-error/CustomError';
import AdminService from 'services/admin.services';

export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { password, passwordNew } = req.body;
    const { id } = req.jwtPayload;

    const result = await AdminService.changePassword(id, password, passwordNew);
    return res.customSuccess(200, 'Password successfully changed.', result);
  } catch (err) {
    console.log(err);
    return res.status(400).send({ message: err.message, success: false, data: {} });
  }
};
