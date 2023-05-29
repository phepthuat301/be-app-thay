import { Request, Response, NextFunction } from 'express';
import CustomerService from 'services/customer.services';
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
    const { keyword } = req.body;

    let page = req.body.page ? parseInt(req.body.page as string) : 1;
    let limit = req.body.limit ? parseInt(req.body.limit as string) : 10;

    const result = CustomerService.getCustomerByName(keyword, page, limit);
    return res.status(200).send({ message: 'Get Customer List By Name Sucessfully', success: true, data: { result } });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ message: err.message, success: false, data: {} });
  }
};
