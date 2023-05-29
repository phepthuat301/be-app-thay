import { Request, Response, NextFunction } from 'express';
import OrderService from 'services/order.services';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { client_id, item_id, treatment_progress, price, paid } = req.body;
    const result = await OrderService.createOrder(client_id, item_id, treatment_progress, price, paid);
    return res.status(200).send({ message: 'Create Order Sucessfully', success: true, data: { result } });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ message: err.message, success: false, data: {} });
  }
};
