import { Request, Response, NextFunction } from 'express';
import CustomerService from 'services/customer.services';
export const deleteCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.body;
    const result = await CustomerService.deleteCustomer(id);
    return res.status(200).send({ message: 'Edit Customer Sucessfully', success: true, data: { result } });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ message: err.message, success: false, data: {} });
  }
};
