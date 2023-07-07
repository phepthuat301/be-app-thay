import { Request, Response, NextFunction } from 'express';
import { CustomError } from 'utils/response/custom-error/CustomError';
import AdminService from 'services/admin.services';

export const verifyPagePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { password } = req.body;
    const result = await AdminService.verifyPagePassword(password);
    return res.status(200).send({ message: 'Login Sucessfully', success: true, result });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ message: err.message, success: false, data: {} });
  }
};
