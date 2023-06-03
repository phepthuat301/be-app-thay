import { Customer } from 'orm/entities/models/customer';
import { Item } from 'orm/entities/models/item';
import { Order } from 'orm/entities/models/order';
import { PAYMENT_ENUM } from 'share/enum';

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
    const customerRepository = getRepository(Customer);
    const [item, customer] = await Promise.all([
      itemRepository.findOne({ where: { id: item_id } }),
      customerRepository.findOne({ where: { id: client_id } }),
    ]);

    if (!item) throw new Error(`Not found service`);
    if (!customer) throw new Error(`Not found customer`);
    if (item.payment === PAYMENT_ENUM.POINT) {
      if (customer.reward_point < item.reward_point) throw new Error(`You dont have enough points to buy this service`);
      customer.reward_point -= item.reward_point;
      await customerRepository.save(customer);
    }
    const newOrder = new Order();
    newOrder.client_id = client_id;
    newOrder.item_id = item.id;
    newOrder.total_treatment = item.number_of_treatments;
    newOrder.price = item.price;
    await orderRepository.save(newOrder);
    return newOrder;
  };

  updateOrder = async (order_id: number, paid: number) => {
    const orderRepository = getRepository(Order);
    const order = await orderRepository.findOne({ where: { id: order_id } });
    if (!order) {
      throw new Error('Order not found');
    }
    await orderRepository.save(order);
    return order;
  };

  // getOrderByName = async (name: string, page: number, limit: number) => {
  //   const orderRepository = getRepository(Order);

  //   const customerRepository = getRepository(Customer);
  //   const customerList = await customerRepository
  //     .createQueryBuilder('customer')
  //     .where('customer.name like :keyword', { keyword: `%${name}%` })
  //     .skip((page - 1) * limit)
  //     .take(limit)
  //     .getMany();
  //   if (!customerList) {
  //     throw new Error('Customer not found');
  //   }
  //   const customerIdList = customerList.map((customer) => customer.id);

  //   const orderList = await orderRepository
  //     .createQueryBuilder('order')
  //     .where('order.client_id IN (:...customerIdList)', { customerIdList })
  //     .skip((page - 1) * limit)
  //     .take(limit)
  //     .getMany();

  //   return orderList;
  // };
  getOrderByName = async (keyword: string, page: number, limit: number) => {
    const orderRepo = getRepository(Order);
    if (keyword) {
      const [order, totalOrders] = await Promise.all([
        orderRepo
          .createQueryBuilder('order')
          .leftJoin('customer', 'customer', 'order.client_id = customer.id')
          .leftJoin('item', 'item', 'order.item_id = item.id')
          .select([
            'order.created_at',
            'customer.name',
            'item.name',
            'item.code',
            'order.price',
          ])
          .where('customer.name ILIKE :keyword', { keyword: `%${keyword}%` })
          .orWhere('item.code ILIKE :keyword', { keyword: `%${keyword}%` })
          .orderBy('order.created_at', 'DESC')
          .offset((page - 1) * limit)
          .limit(limit)
          .getRawMany(),
        orderRepo
          .createQueryBuilder('order')
          .leftJoin('customer', 'customer', 'order.client_id = customer.id')
          .leftJoin('item', 'item', 'order.item_id = item.id')
          .where('customer.name ILIKE :keyword', { keyword: `%${keyword}%` })
          .orWhere('item.code ILIKE :keyword', { keyword: `%${keyword}%` })
          .getCount(),
      ])
      return { order, totalOrders };
    }
    const [order, totalOrders] = await Promise.all([
      orderRepo
        .createQueryBuilder('order')
        .leftJoin('customer', 'customer', 'order.client_id = customer.id')
        .leftJoin('item', 'item', 'order.item_id = item.id')
        .select([
          'order.created_at',
          'customer.name',
          'item.name',
          'item.code',
          'order.price',
        ])
        .orderBy('order.created_at', 'DESC')
        .offset((page - 1) * limit)
        .limit(limit)
        .getRawMany(),
      orderRepo.count()
    ])
    return { order, totalOrders };
  }
}
