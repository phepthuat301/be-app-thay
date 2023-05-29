import { Request, Response, NextFunction } from 'express';
import { CustomError } from 'utils/response/custom-error/CustomError';
import AdminService from 'services/admin.services';

export const getAdminInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.jwtPayload;
    const result = await AdminService.getAdminInfo(id);
    return res.status(200).send({ message: 'Login Sucessfully', success: true, data: { token } });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ message: err.message, success: false, data: {} });
  }
};
