import { Request, Response, NextFunction } from 'express';
import CustomerService from 'services/customer.servies';
export const getCustomerList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = CustomerService.getCustomerList();
    return res.status(200).send({ message: 'Get Customer List Sucessfully', success: true, data: { result } });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ message: err.message, success: false, data: {} });
  }
};

export const getCustomerListByName = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const keyword = req.body;
    const result = CustomerService.getCustomerByName(keyword);
    return res.status(200).send({ message: 'Get Customer List By Name Sucessfully', success: true, data: { result } });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ message: err.message, success: false, data: {} });
  }
};
