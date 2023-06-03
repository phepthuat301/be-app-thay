import { Customer } from 'orm/entities/models/customer';
import { History } from 'orm/entities/models/history';
import { Order } from 'orm/entities/models/order';

import { getRepository } from 'typeorm';
import { OrderService } from './order.services';
import { ConfigurationServices } from './configuration.services';
import { REWARD_APPRERANCE_POINT } from 'share/configurations/constant';

export class HistoryService {
  private static instance: HistoryService;

  public static getInstance(): HistoryService {
    if (!HistoryService.instance) {
      HistoryService.instance = new HistoryService();
    }

    return HistoryService.instance;
  }

  createHistory = async (order_id: number, price: number) => {
    const historyRepository = getRepository(History);

    const historyCount = await historyRepository.count({ where: { order_id } });

    const newHistory = new History();
    newHistory.order_id = order_id;
    newHistory.treatment_progress = historyCount + 1;
    newHistory.pay_date = new Date();
    newHistory.price = price;
    await historyRepository.save(newHistory);

    //get customer from order id
    const orderRepository = getRepository(Order);
    const order = await orderRepository.findOne({ where: { id: order_id } });
    if (!order) {
      throw new Error('Order not found');
    }
    const customerRepository = getRepository(Customer);
    const customer = await customerRepository.findOne({ where: { id: order.client_id } });
    if (!customer) {
      throw new Error('Customer not found');
    }

    const reward_apprerance_point = await ConfigurationServices.getInstance().getConfigValue(REWARD_APPRERANCE_POINT);
    //update reward point
    customer.reward_point += +reward_apprerance_point;
    await customerRepository.save(customer);

    return newHistory;
  };

  getHistoryByName = async (name: string, page: number, limit: number) => {
    const customerRepository = getRepository(Customer);
    const orderRepository = getRepository(Order);

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

    //get orderlist from customer id

    const orderList = await orderRepository
      .createQueryBuilder('order')
      .where('order.client_id IN (:...customerIdList)', { customerIdList })
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    const orderIdList = orderList.map((order) => order.id);

    //get history from order id

    const historyList = await getRepository(History)
      .createQueryBuilder('history')
      .where('history.order_id IN (:...orderIdList)', { orderIdList })
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return historyList;
  };
}
