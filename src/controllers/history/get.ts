import { Request, Response } from 'express';
import { HistoryService } from 'services/history.services';

export const getHistoryByName = async (req: Request, res: Response) => {
  try {
    const { keyword } = req.body;
    let page = req.body.page ? parseInt(req.body.page as string) : 1;
    let limit = req.body.limit ? parseInt(req.body.limit as string) : 10;
    const data = await HistoryService.getInstance().getHistoryByName(keyword, page, limit);
    return res.status(200).send({ message: 'Get History Sucessfully', success: true, data });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ message: err.message, success: false, data: {} });
  }
};

export const getHistoryByUser = async (req: Request, res: Response) => {
  try {
    let page = req.body.page ? parseInt(req.body.page as string) : 1;
    let limit = req.body.limit ? parseInt(req.body.limit as string) : 10;
    const data = await HistoryService.getInstance().getHistoryByUser(page, limit, req.body.id);
    return res.status(200).send({ message: 'Get History Sucessfully', success: true, data });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ message: err.message, success: false, data: {} });
  }
};

export const deleteHistories = async (req: Request, res: Response) => {
  try {
    const { ids } = req.body
    const data = await HistoryService.getInstance().deleteHistories(ids);
    return res.status(200).send({ message: 'Get History Sucessfully', success: true, data });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ message: err.message, success: false, data: {} });
  }
};