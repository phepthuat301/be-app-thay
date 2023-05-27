import { Request, Response, NextFunction } from 'express';
import { CustomError } from 'utils/response/custom-error/CustomError';
import AdminService from 'services/admin.services';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, name, phone } = req.body;
    const result = await AdminService.register(name, email, password, phone);
    return res.status(200).send({ message: 'Register Sucessfully', success: true, data: { result } });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ message: err.message, success: false, data: {} });
  }
};
