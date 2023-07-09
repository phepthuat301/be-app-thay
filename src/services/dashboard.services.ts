import { Customer } from 'orm/entities/models/customer';
import { History } from 'orm/entities/models/history';
import { Order } from 'orm/entities/models/order';
import { LIST_STATISTIC_MONTH, LIST_STATISTIC_YEAR } from 'share/configurations/constant';
import { getRepository } from 'typeorm';
import { ConfigurationServices } from './configuration.services';

export class DashboardService {
  private static instance: DashboardService;
  private constructor() { }
  public static getInstance(): DashboardService {
    if (!this.instance) {
      this.instance = new DashboardService();
    }

    return this.instance;
  }

  getStatistics = async (year: number, month: number) => {
    const [statisticMonth, statisticYear] = await Promise.all([
      ConfigurationServices.getInstance().getConfigValue(LIST_STATISTIC_MONTH),
      ConfigurationServices.getInstance().getConfigValue(LIST_STATISTIC_YEAR),
    ])

    const [
      totalCustomer,
      totalPaid,
      totalPaidPerMonth,
      totalPaidPerDay,
      totalOrderPerMonth,
      totalOrderPerDay,
      totalNewCustomerPerMonth,
    ] = await Promise.all([
      getRepository(Customer).count(), // total user

      //minus refund
      getRepository(History) // total paid
        .createQueryBuilder('history')
        .innerJoin('history.order_id', 'order')
        .select('SUM(history.price) - SUM(order.refund_amount', 'total_paid_minus_refund')
        .getRawOne(),

      // getRepository(History)
      //   .createQueryBuilder('history')
      //   .select('SUM(history.price)', 'total_paid')
      //   .addSelect('DATE_PART(\'month\', history.created_at)', 'month')
      //   .where('DATE_PART(\'year\', history.created_at) = :year', { year })
      //   .groupBy('month')
      //   .getRawMany(),

      //minus refund
      getRepository(History)
        .createQueryBuilder('history')
        .innerJoin('history.order_id', 'order')
        .select('SUM(history.price) - SUM(order.refund_amount', 'total_paid_minus_refund')
        .addSelect('DATE_PART(\'month\', history.created_at)', 'month')
        .where('DATE_PART(\'year\', history.created_at) = :year', { year })
        .groupBy('month')
        .getRawMany(),

      // getRepository(History)
      //   .createQueryBuilder('history')
      //   .select('SUM(history.price)', 'total_paid')
      //   .addSelect('DATE_PART(\'day\', history.created_at)', 'day')
      //   .where('DATE_PART(\'month\', history.created_at) = :month', { month })
      //   .groupBy('day')
      //   .getRawMany(),

      //minus refund
      getRepository(History)
        .createQueryBuilder('history')
        .innerJoin('history.order_id', 'order')
        .select('SUM(history.price) - SUM(order.refund_amount', 'total_paid_minus_refund')
        .addSelect('DATE_PART(\'day\', history.created_at)', 'day')
        .where('DATE_PART(\'month\', history.created_at) = :month', { month })
        .groupBy('day')
        .getRawMany(),

      getRepository(Order)
        .createQueryBuilder('order')
        .select('COUNT(order.id)', 'total_order')
        .addSelect('EXTRACT(MONTH FROM order.created_at)', 'month')
        .where('EXTRACT(YEAR FROM order.created_at) = :year', { year })
        .groupBy('month')
        .getRawMany(),
      getRepository(Order)
        .createQueryBuilder('order')
        .select('COUNT(order.id)', 'total_order')
        .addSelect('EXTRACT(DAY FROM order.created_at)', 'day')
        .where('EXTRACT(MONTH FROM order.created_at) = :month', { month })
        .groupBy('day')
        .getRawMany(),
      getRepository(Customer)
        .createQueryBuilder('customer')
        .select('COUNT(customer.id)', 'total_customer')
        .addSelect('EXTRACT(MONTH FROM customer.created_at)', 'month')
        .where('EXTRACT(YEAR FROM customer.created_at) = :year', { year })
        .groupBy('month')
        .getRawMany(),
      //get total refund
    ])
    return {
      totalCustomer,
      totalPaid,
      totalPaidPerMonth: totalPaidPerMonth.map(item => {
        return {
          name: `Tháng ${item.month}`,
          totalPaid: parseInt(item.total_paid)
        }
      }),
      totalPaidPerDay: totalPaidPerDay.map(item => {
        return {
          name: `Ngày ${item.day}`,
          totalPaid: parseInt(item.total_paid)
        }
      }),
      totalOrderPerMonth: totalOrderPerMonth.map(item => {
        return {
          name: `Tháng ${item.month}`,
          totalOrder: parseInt(item.total_order)
        }
      }),
      totalOrderPerDay: totalOrderPerDay.map(item => {
        return {
          name: `Ngày ${item.day}`,
          totalOrder: parseInt(item.total_order)
        }
      }),
      totalNewCustomerPerMonth: totalNewCustomerPerMonth.map(item => {
        return {
          name: `Tháng ${item.month}`,
          totalCustomer: parseInt(item.total_customer)
        }
      }),
      statisticMonth: statisticMonth.split(','),
      statisticYear: statisticYear.split(','),
    };
  };
}
