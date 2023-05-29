import { Customer } from 'orm/entities/models/customer';
import { Order } from 'orm/entities/models/order';
import { getRepository } from 'typeorm';

const getStatistics = async (year: number, month: number) => {
  //get total customer
  const totalCustomer = await getRepository(Customer).count();

  //get total paid
  const totalPaid = await getRepository(Order)
    .createQueryBuilder('order')
    .select('SUM(order.paid)', 'total_paid')
    .getRawOne();

  //get total paid per month, input by year
  const totalPaidPerMonth = await getRepository(Order)
    .createQueryBuilder('order')
    .select('SUM(order.paid)', 'total_paid')
    .addSelect('MONTH(order.created_at)', 'month')
    .where('YEAR(order.created_at) = :year', { year })
    .groupBy('month')
    .getRawMany();

  //get total paid per day, input by month

  const totalPaidPerDay = await getRepository(Order)
    .createQueryBuilder('order')
    .select('SUM(order.paid)', 'total_paid')
    .addSelect('DAY(order.created_at)', 'day')
    .where('MONTH(order.created_at) = :month', { month })
    .groupBy('day')
    .getRawMany();

  //get total order per month, input by year
  const totalOrderPerMonth = await getRepository(Order)
    .createQueryBuilder('order')
    .select('COUNT(order.id)', 'total_order')
    .addSelect('MONTH(order.created_at)', 'month')
    .where('YEAR(order.created_at) = :year', { year })
    .groupBy('month')
    .getRawMany();

  //get total order per day, input by month
  const totalOrderPerDay = await getRepository(Order)
    .createQueryBuilder('order')
    .select('COUNT(order.id)', 'total_order')
    .addSelect('DAY(order.created_at)', 'day')
    .where('MONTH(order.created_at) = :month', { month })
    .groupBy('day')
    .getRawMany();

  //get total new customer in month
  const totalNewCustomerPerMonth = await getRepository(Customer)
    .createQueryBuilder('customer')
    .select('COUNT(customer.id)', 'total_customer')
    .addSelect('MONTH(customer.created_at)', 'month')
    .where('YEAR(customer.created_at) = :year', { year })
    .groupBy('month')
    .getRawMany();

  return {
    totalCustomer,
    totalPaid,
    totalPaidPerMonth,
    totalPaidPerDay,
    totalOrderPerMonth,
    totalOrderPerDay,
    totalNewCustomerPerMonth,
  };
};

const DashboardService = {
  getStatistics,
};

export default DashboardService;
