import { Request, Response, NextFunction } from 'express';

import { ItemService, ItemPayload } from 'services/item.services';
export const edit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, name, code, price, reward_point, number_of_treatments, status } = req.body;
    const item: ItemPayload = {
      id,
      name,
      code,
      price,
      reward_point,
      number_of_treatments,
      status,
    };
    const data = await ItemService.getInstance().editItem(item);
    return res.status(200).send({ message: 'Edit Item Sucessfully', success: true, data });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ message: err.message, success: false, data: {} });
  }
};