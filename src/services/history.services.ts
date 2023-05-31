import { Customer } from 'orm/entities/models/customer';
import { History } from 'orm/entities/models/history';
import { Order } from 'orm/entities/models/order';

import { getRepository } from 'typeorm';

const createHistory = async (order_id: number, treatment_progress: number, pay_date: Date, price: number) => {
  const historyRepository = getRepository(History);

  const newHistory = new History();
  newHistory.order_id = order_id;
  newHistory.treatment_progress = treatment_progress;
  newHistory.pay_date = pay_date;
  newHistory.price = price;
  await historyRepository.save(newHistory);
  return newHistory;
};

const getHistoryByName = async (name: string, page: number, limit: number) => {
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

const HistoryService = {
  createHistory,
  getHistoryByName,
};

export default HistoryService;
