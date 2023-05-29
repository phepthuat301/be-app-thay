import { Request, Response, NextFunction } from 'express';
import CustomerService from 'services/customer.services';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, date_of_birth, address, phone, gender, note, pathological } = req.body;
    const result = await CustomerService.createCustomer({
      name,
      date_of_birth,
      address,
      phone,
      gender,
      note,
      pathological,
    });
    return res.status(200).send({ message: 'Create Customer Sucessfully', success: true, data: { result } });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ message: err.message, success: false, data: {} });
  }
};
