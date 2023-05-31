import { Request, Response, NextFunction } from 'express';
import {CustomerService} from 'services/customer.services';
import { CustomerPayload } from 'services/customer.services';
export const edit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, name, date_of_birth, address, phone, gender, note, pathological, reward_point } = req.body;
    const customer: CustomerPayload = {
      name,
      date_of_birth,
      address,
      phone,
      gender,
      note,
      pathological,
      reward_point,
    };
    const data = await CustomerService.getInstance().editCustomer(customer, id);
    return res.status(200).send({ message: 'Edit Customer Sucessfully', success: true, data });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ message: err.message, success: false, data: {} });
  }
};
