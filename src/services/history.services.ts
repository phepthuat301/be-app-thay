import { History } from 'orm/entities/models/history';

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
  const historyRepository = getRepository(History);

  const historyList = await historyRepository
    .createQueryBuilder('history')
    .innerJoin('history.order', 'order')
    .innerJoin('order.client', 'client', 'client.name = :name', { name })
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
