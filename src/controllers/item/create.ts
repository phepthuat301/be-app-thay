import { Request, Response, NextFunction } from 'express';
import ItemService from 'services/item.services';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, price, reward_point, number_of_treatments } = req.body;
    const result = await ItemService.createItem(name, price, reward_point, number_of_treatments);
    return res.status(200).send({ message: 'Create Customer Sucessfully', success: true, data: { result } });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ message: err.message, success: false, data: {} });
  }
};
