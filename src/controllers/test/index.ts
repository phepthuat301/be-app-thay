import { Request, Response } from 'express';
import { Item } from 'orm/entities/models/item';
import { Order } from 'orm/entities/models/order';
import { getRepository } from 'typeorm';


export const test = async (req: Request, res: Response) => {
    try {
        const items = await getRepository(Item).find();
        const orders = await getRepository(Order).find();
        console.log(orders.length);
        for (const order of orders) {
            order.unit_price = items.filter(item => item.id === order.item_id)[0].unit_price;
        }
        await getRepository(Order).save(orders);
        return res.status(200).send({ message: 'Test Sucessfully', success: true, data: {} });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ message: err.message, success: false, data: {} });
    }
};
