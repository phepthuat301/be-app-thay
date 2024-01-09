import { Customer } from 'orm/entities/models/customer';
import { History } from 'orm/entities/models/history';
import { Order } from 'orm/entities/models/order';

import { getRepository, ILike, In, Not } from 'typeorm';
import { ConfigurationServices } from './configuration.services';

export class HistoryService {
  private static instance: HistoryService;

  public static getInstance(): HistoryService {
    if (!HistoryService.instance) {
      HistoryService.instance = new HistoryService();
    }

    return HistoryService.instance;
  }

  createHistory = async (order_id: number, price: number, notVisit: boolean) => {
    //get customer from order id
    const orderRepository = getRepository(Order);
    const order = await orderRepository.findOne({ where: { id: order_id } });
    if (!order) {
      throw new Error('Order not found');
    }
    order.updatedAt = new Date();
    await order.save();

    const customerRepository = getRepository(Customer);
    const customer = await customerRepository.findOne({ where: { id: order.client_id } });
    if (!customer) {
      throw new Error('Customer not found');
    }

    const historyRepository = getRepository(History);

    const queryResult = await historyRepository
      .createQueryBuilder('history')
      .select('SUM(history.unit_price)', 'sum')
      .addSelect('COUNT(*)', 'count')
      .where('history.order_id = :orderId', { orderId: order.id })
      .getRawOne();

    const sumOfUnitPrice = parseFloat(queryResult.sum) || 0;
    const numberOfRecords = parseInt(queryResult.count) || 0;

    const newHistory = new History();

    if (sumOfUnitPrice === order.price || notVisit) {
      newHistory.unit_price = 0;
    } else if (sumOfUnitPrice + order.unit_price >= order.price) {
      newHistory.unit_price = order.price - sumOfUnitPrice;
    } else {
      newHistory.unit_price = order.unit_price;
    }

    newHistory.order_id = order_id;
    newHistory.treatment_progress = numberOfRecords + 1;
    newHistory.pay_date = new Date();
    newHistory.price = price;

    await historyRepository.save(newHistory);


    // const reward_apprerance_point = await ConfigurationServices.getInstance().getConfigValue(REWARD_APPRERANCE_POINT);
    //update reward point
    if (!notVisit) {
      // customer.reward_point += +reward_apprerance_point;
      await customerRepository.save(customer);
    }

    return newHistory;
  };

  // getHistoryByName = async (name: string, page: number, limit: number) => {
  //   const customerRepository = getRepository(Customer);
  //   const orderRepository = getRepository(Order);

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

  //   //get orderlist from customer id

  //   const orderList = await orderRepository
  //     .createQueryBuilder('order')
  //     .where('order.client_id IN (:...customerIdList)', { customerIdList })
  //     .skip((page - 1) * limit)
  //     .take(limit)
  //     .getMany();

  //   const orderIdList = orderList.map((order) => order.id);

  //   //get history from order id

  //   const historyList = await getRepository(History)
  //     .createQueryBuilder('history')
  //     .where('history.order_id IN (:...orderIdList)', { orderIdList })
  //     .skip((page - 1) * limit)
  //     .take(limit)
  //     .getMany();

  //   return historyList;
  // };

  getHistoryByName = async (keyword: string, page: number, limit: number) => {
    const historyRepo = getRepository(History);
    if (keyword) {
      const [history, totalHistories] = await Promise.all([
        historyRepo
          .createQueryBuilder('history')
          .leftJoin('orders', 'order', 'history.order_id = order.id')
          .leftJoin('customer', 'customer', 'order.client_id = customer.id')
          .leftJoin('item', 'item', 'order.item_id = item.id')
          .select([
            'history.created_at',
            'customer.name',
            'item.name',
            'history.treatment_progress',
            'order.total_treatment',
            'history.price'
          ])
          .where('customer.name ILIKE :keyword', { keyword: `%${keyword}%` })
          .orWhere('item.code ILIKE :keyword', { keyword: `%${keyword}%` })
          .andWhere('history.unit_price <> 0 OR history.price <> 0')
          .orderBy('history.created_at', 'DESC')
          .offset((page - 1) * limit)
          .limit(limit)
          .getRawMany(),
        historyRepo
          .createQueryBuilder('history')
          .leftJoin('orders', 'orders', 'history.order_id = orders.id')
          .leftJoin('customer', 'customer', 'orders.client_id = customer.id')
          .leftJoin('item', 'item', 'orders.item_id = item.id')
          .where('customer.name ILIKE :keyword', { keyword: `%${keyword}%` })
          .orWhere('item.code ILIKE :keyword', { keyword: `%${keyword}%` })
          .andWhere('history.unit_price <> 0 OR history.price <> 0')
          .getCount(),
      ])
      return { history, totalHistories };
    }
    const [history, totalHistories] = await Promise.all([
      historyRepo
        .createQueryBuilder('history')
        .leftJoin('orders', 'orders', 'history.order_id = orders.id')
        .leftJoin('customer', 'customer', 'orders.client_id = customer.id')
        .leftJoin('item', 'item', 'orders.item_id = item.id')
        .select([
          'history.created_at',
          'customer.name',
          'item.name',
          'history.treatment_progress',
          'orders.total_treatment',
          'history.price'
        ])
        .andWhere('history.unit_price <> 0 OR history.price <> 0')
        .orderBy('history.created_at', 'DESC')
        .offset((page - 1) * limit)
        .limit(limit)
        .getRawMany(),
      historyRepo
        .createQueryBuilder('history')
        .leftJoin('orders', 'orders', 'history.order_id = orders.id')
        .leftJoin('customer', 'customer', 'orders.client_id = customer.id')
        .leftJoin('item', 'item', 'orders.item_id = item.id')
        .select([
          'history.created_at',
          'customer.name',
          'item.name',
          'history.treatment_progress',
          'orders.total_treatment',
          'history.price'
        ])
        .andWhere('history.unit_price <> 0 OR history.price <> 0')
        .getCount(),
    ])
    return { history, totalHistories };
  };

  getHistoryByUser = async (page: number, limit: number, userId: string) => {
    const historyRepo = getRepository(History);
    const [history, totalHistories] = await Promise.all([
      historyRepo
        .query(`
          SELECT
            history.created_at,
            customer.name AS customer_name,
            item.name AS item_name,
            history.treatment_progress,
            orders.total_treatment,
            history.price
          FROM
              history
          LEFT JOIN
              orders ON history.order_id = orders.id
          LEFT JOIN
              customer ON orders.client_id = customer.id
          LEFT JOIN
              item ON orders.item_id = item.id
          WHERE
              customer.id = $1
              AND (history.unit_price <> 0 OR history.price <> 0)
          ORDER BY
              history.created_at DESC
          OFFSET $2
          LIMIT $3;`,
          [userId, (page - 1) * limit, limit]),
      historyRepo.query(`
          SELECT COUNT(*) as count
          FROM history
          LEFT JOIN orders ON history.order_id = orders.id
          LEFT JOIN customer ON orders.client_id = customer.id
          WHERE customer.id = $1
            AND (history.unit_price <> 0 OR history.price <> 0)
        `, [userId])

    ])
    return { history, totalHistories: totalHistories[0].count };
  };

  deleteHistories = async (ids: number[]) => {
    const histories = await getRepository(History).find({ where: { id: In(ids) } })
    if (histories.length === 0) throw new Error('Not found histories')
  };
}
