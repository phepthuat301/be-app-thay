import { Request, Response, NextFunction } from 'express';
import AdminService from 'services/admin.services';

export const getAdminInfo = async (req: Request, res: Response) => {
  try {
    const { id } = req.jwtPayload;
    const data = await AdminService.getAdminInfo(id);
    return res.status(200).send({ message: 'Login Sucessfully', success: true, data });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ message: err.message, success: false, data: {} });
  }
};
