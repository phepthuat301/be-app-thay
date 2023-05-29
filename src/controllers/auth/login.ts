import { Request, Response, NextFunction } from 'express';
import { CustomError } from 'utils/response/custom-error/CustomError';
import AdminService from 'services/admin.services';

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const data = await AdminService.login(email, password);
    return res.status(200).send({ message: 'Login Sucessfully', success: true, data});
  } catch (err) {
    console.log(err);
    return res.status(400).send({ message: err.message, success: false, data: {} });
  }
};
