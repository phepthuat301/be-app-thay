import { Request, Response, NextFunction } from 'express';
import { HistoryService } from 'services/history.services';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { order_id, treatment_progress, pay_date, price } = req.body;
    const data = await HistoryService.getInstance().createHistory(order_id, treatment_progress, pay_date, price);
    return res.status(200).send({ message: 'Create History Sucessfully', success: true, data });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ message: err.message, success: false, data: {} });
  }
};
