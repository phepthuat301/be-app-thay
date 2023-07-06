import { Request, Response, NextFunction } from 'express';
import { OrderService } from 'services/order.services';

export const refundById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { order_id, amount } = req.body;
    const data = await OrderService.getInstance().refundById(order_id, amount);
    return res.status(200).send({ message: 'Create Order Sucessfully', success: true, data });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ message: err.message, success: false, data: {} });
  }
};
