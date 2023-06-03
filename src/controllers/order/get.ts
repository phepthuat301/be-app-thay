import { Request, Response, NextFunction } from 'express';
import { OrderService } from 'services/order.services';

export const getOrderByName = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { keyword } = req.body;
    let page = req.body.page ? parseInt(req.body.page as string) : 1;
    let limit = req.body.limit ? parseInt(req.body.limit as string) : 10;
    const data = await OrderService.getInstance().getOrderByName(keyword, page, limit);
    return res.status(200).send({ message: 'Get Order Sucessfully', success: true, data });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ message: err.message, success: false, data: {} });
  }
};
