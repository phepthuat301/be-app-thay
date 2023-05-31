import { Request, Response, NextFunction } from 'express';
import { ItemService } from 'services/item.services';
export const getItemByName = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { keyword } = req.body;
    let page = req.body.page ? parseInt(req.body.page as string) : 1;
    let limit = req.body.limit ? parseInt(req.body.limit as string) : 10;
    const data = await ItemService.getInstance().getItemByName(keyword, page, limit);
    return res.status(200).send({ message: 'Get Item By Name Sucessfully', success: true, data });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ message: err.message, success: false, data: {} });
  }
};

export const getItemList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await ItemService.getInstance().getItemList();
    return res.status(200).send({ message: 'Get Item By Name Sucessfully', success: true, data });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ message: err.message, success: false, data: {} });
  }
};
