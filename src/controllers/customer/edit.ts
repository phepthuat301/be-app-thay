import { Request, Response, NextFunction } from 'express';
import CustomerService from 'services/customer.servies';
import { CustomerPayload } from 'services/customer.servies';
export const edit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, name, date_of_birth, address, phone, gender, note, pathological } = req.body;
    const customer: CustomerPayload = {
      name,
      date_of_birth,
      address,
      phone,
      gender,
      note,
      pathological,
    };
    const result = await CustomerService.editCustomer(customer, id);
    return res.status(200).send({ message: 'Edit Customer Sucessfully', success: true, data: { result } });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ message: err.message, success: false, data: {} });
  }
};
