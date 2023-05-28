import { Request, Response, NextFunction } from 'express';

import ItemService from 'services/item.services';
export const deleteItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.body;

    const result = await ItemService.deleteItem(id);
    return res.status(200).send({ message: 'Delete Item Sucessfully', success: true, data: { result } });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ message: err.message, success: false, data: {} });
  }
};
