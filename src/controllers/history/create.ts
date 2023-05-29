import { Request, Response, NextFunction } from 'express';
import HistoryService from 'services/history.services';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { order_id, treatment_progress, pay_date, price } = req.body;
    const result = await HistoryService.createHistory(order_id, treatment_progress, pay_date, price);
    return res.status(200).send({ message: 'Create History Sucessfully', success: true, data: { result } });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ message: err.message, success: false, data: {} });
  }
};
