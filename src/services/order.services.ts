import { Customer } from 'orm/entities/models/customer';
import { Order } from 'orm/entities/models/order';

import { getRepository } from 'typeorm';

const createOrder = async (
  client_id: number,
  item_id: number,
  treatment_progress: number,
  price: number,
  paid: number,
) => {
  const orderRepository = getRepository(Order);

  const newOrder = new Order();
  newOrder.client_id = client_id;
  newOrder.item_id = item_id;
  newOrder.treatment_progress = treatment_progress;
  newOrder.price = price;
  newOrder.paid = paid;
  await orderRepository.save(newOrder);
  return newOrder;
};

const getOderByName = async (name: string, page: number, limit: number) => {
  const orderRepository = getRepository(Order);

  const orderList = await orderRepository
    .createQueryBuilder('order')
    .innerJoin('order.client', 'client', 'client.name = :name', { name })
    .skip((page - 1) * limit)
    .take(limit)
    .getMany();

  return orderList;
};
const OrderService = {
  createOrder,
  getOderByName,
};

export default OrderService;
