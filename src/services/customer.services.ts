import { Customer } from 'orm/entities/models/customer';
import { CUSTOMER_STATUS_ENUM, GENDER } from 'share/enum';
import { getRepository } from 'typeorm';
import { ReferralService } from './referral.services';
import { Order } from 'orm/entities/models/order';
import { History } from 'orm/entities/models/history';

export interface CustomerPayload {
  name?: string;
  date_of_birth?: Date;
  address?: string;
  phone?: string;
  gender?: GENDER;
  note?: string;
  refferal_code?: string;
  pathological?: string;
  reward_point?: number;
}

export const PREFIX_REFERRAL_CODE = 'THIENHIEU';

export class CustomerService {
  private static instance: CustomerService;
  private constructor() {}

  public static getInstance(): CustomerService {
    if (!CustomerService.instance) {
      CustomerService.instance = new CustomerService();
    }

    return CustomerService.instance;
  }

  createCustomer = async (customer: CustomerPayload, refferal_code: string) => {
    const customerRepository = getRepository(Customer);

    const oldCustomer = await customerRepository.findOne({ where: { phone: customer.phone } });
    if (oldCustomer) {
      throw new Error('Customer already exists');
    }

    const count = await customerRepository.count();
    const newCustomer = new Customer();
    newCustomer.name = customer.name;
    newCustomer.date_of_birth = customer.date_of_birth;
    newCustomer.address = customer.address;
    newCustomer.phone = customer.phone;
    newCustomer.gender = customer.gender as GENDER;
    newCustomer.note = customer.note;
    newCustomer.refferal_code = `${PREFIX_REFERRAL_CODE}-${count + 1}`;
    newCustomer.pathological = customer.pathological;
    newCustomer.reward_point = 0;
    newCustomer.status = CUSTOMER_STATUS_ENUM.ACTIVE;
    await customerRepository.save(newCustomer);

    if (refferal_code) {
      await ReferralService.getInstance().submitReferral(refferal_code, newCustomer.id);
    }

    return newCustomer;
  };
  editCustomer = async (customer: CustomerPayload, id: number) => {
    const customerRepository = getRepository(Customer);
    const customerToUpdate = await customerRepository.findOne({ where: { id, status: CUSTOMER_STATUS_ENUM.ACTIVE } });

    if (!customerToUpdate) {
      throw new Error('Customer not found');
    }
    customerToUpdate.name = customer.name;
    customerToUpdate.date_of_birth = customer.date_of_birth;
    customerToUpdate.address = customer.address;
    customerToUpdate.phone = customer.phone;
    customerToUpdate.gender = customer.gender;
    customerToUpdate.note = customer.note;
    customerToUpdate.pathological = customer.pathological;
    customerToUpdate.reward_point = customer.reward_point;
    await customerRepository.save(customerToUpdate);
    return customerToUpdate;
  };

  deleteCustomer = async (id: number) => {
    const customerRepository = getRepository(Customer);
    const customer = await customerRepository.findOne({ where: { id, status: CUSTOMER_STATUS_ENUM.ACTIVE } });
    if (!customer) {
      throw new Error('Customer not found');
    }
    customer.status = CUSTOMER_STATUS_ENUM.DELETED;
    await customerRepository.save(customer);
  };
  getCustomer = async (id: number) => {
    const customerRepository = getRepository(Customer);
    const customer = await customerRepository.findOne({ where: { id } });
    if (!customer) {
      throw new Error('Customer not found');
    }
    return customer;
  };

  getCustomerList = async () => {
    const customerRepository = getRepository(Customer);
    const customerList = await customerRepository.find();
    return customerList;
  };

  getCustomerByName = async (keyword: string, page: number, limit: number) => {
    const customerRepository = getRepository(Customer);
    const orderRepository = getRepository(Order);
    const historyRepository = getRepository(History);

    const customerList = await customerRepository
      .createQueryBuilder('customer')
      .where('customer.name like :keyword', { keyword: `%${keyword}%` })
      .andWhere('customer.status = :status', { status: CUSTOMER_STATUS_ENUM.ACTIVE })
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    const result = await Promise.all(
      customerList.map(async (customer) => {
        const orders = await orderRepository.find({ where: { client_id: customer.id } });

        const orderList = await Promise.all(
          orders.map(async (order) => {
            const progress = await historyRepository.count({ where: { order_id: order.id } });
            const orderElement = { ...order, progress: progress };
            return orderElement;
          }),
        );

        return { ...customer, orders: orderList };
      }),
    );

    return result;
  };
}
