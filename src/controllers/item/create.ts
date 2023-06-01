import { Request, Response, NextFunction } from 'express';
import { ItemService } from 'services/item.services';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, price, reward_point, number_of_treatments, code, payment_method } = req.body;
    const data = await ItemService.getInstance().createItem(
      name,
      price,
      reward_point,
      number_of_treatments,
      code,
      payment_method,
    );
    return res.status(200).send({ message: 'Create Item Sucessfully', success: true, data });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ message: err.message, success: false, data: {} });
  }
};
