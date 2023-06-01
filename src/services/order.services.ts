import { Customer } from 'orm/entities/models/customer';
import { Item } from 'orm/entities/models/item';
import { Order } from 'orm/entities/models/order';

import { getRepository } from 'typeorm';

export class OrderService {
  private static instance: OrderService;

  public static getInstance(): OrderService {
    if (!OrderService.instance) {
      OrderService.instance = new OrderService();
    }

    return OrderService.instance;
  }

  createOrder = async (client_id: number, item_id: number, paid: number) => {
    const orderRepository = getRepository(Order);
    const itemRepository = getRepository(Item);

    const item = await itemRepository.findOne({ where: { id: item_id } });

    const newOrder = new Order();
    newOrder.client_id = client_id;
    newOrder.item_id = item.id;
    newOrder.total_treatment = item.number_of_treatments;
    newOrder.price = item.price;
    newOrder.paid = paid;
    await orderRepository.save(newOrder);
    return newOrder;
  };

  updateOrder = async (order_id: number, paid: number) => {
    const orderRepository = getRepository(Order);
    const order = await orderRepository.findOne({ where: { id: order_id } });
    if (!order) {
      throw new Error('Order not found');
    }
    order.paid = paid;
    await orderRepository.save(order);
    return order;
  };

  getOderByName = async (name: string, page: number, limit: number) => {
    const orderRepository = getRepository(Order);

    const customerRepository = getRepository(Customer);
    const customerList = await customerRepository
      .createQueryBuilder('customer')
      .where('customer.name like :keyword', { keyword: `%${name}%` })
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();
    if (!customerList) {
      throw new Error('Customer not found');
    }
    const customerIdList = customerList.map((customer) => customer.id);

    const orderList = await orderRepository
      .createQueryBuilder('order')
      .where('order.client_id IN (:...customerIdList)', { customerIdList })
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return orderList;
  };
}
