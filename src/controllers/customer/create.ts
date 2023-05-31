import { Request, Response, NextFunction } from 'express';
import {CustomerService} from 'services/customer.services';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, date_of_birth, address, phone, gender, note, pathological, referral_code } = req.body;
    const data = await CustomerService.getInstance().createCustomer(
      {
        name,
        date_of_birth,
        address,
        phone,
        gender,
        note,
        pathological,
      },
      referral_code,
    );
    return res.status(200).send({ message: 'Create Customer Sucessfully', success: true, data });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ message: err.message, success: false, data: {} });
  }
};