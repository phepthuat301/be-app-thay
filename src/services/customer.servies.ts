import { Customer } from 'orm/entities/models/customer';
import { GENDER } from 'share/enum';
import { getRepository } from 'typeorm';

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

const createCustomer = async (customer: CustomerPayload) => {
  const customerRepository = getRepository(Customer);

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

  await customerRepository.save(newCustomer);
  return newCustomer;
};
const editCustomer = async (customer: CustomerPayload, id: number) => {
  const customerRepository = getRepository(Customer);
  const customerToUpdate = await customerRepository.findOne({ where: { id: id } });
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
};

const deleteCustomer = async (id: number) => {
  const customerRepository = getRepository(Customer);
  const customer = await customerRepository.findOne({ where: { id } });
  if (!customer) {
    throw new Error('Customer not found');
  }
  await customerRepository.delete(id);
};
const getCustomer = async (id: number) => {
  const customerRepository = getRepository(Customer);
  const customer = await customerRepository.findOne({ where: { id } });
  if (!customer) {
    throw new Error('Customer not found');
  }
  return customer;
};

const getCustomerList = async () => {
  const customerRepository = getRepository(Customer);
  const customerList = await customerRepository.find();
  return customerList;
};

const getCustomerByName = async (keyword: string, page: number, limit: number) => {
  const customerRepository = getRepository(Customer);
  //where column name like %keyword%
  const customerList = await customerRepository
    .createQueryBuilder('customer')
    .where('customer.name like :keyword', { keyword: `%${keyword}%` })
    .skip((page - 1) * limit)
    .take(limit)
    .getMany();
  return customerList;
};

const CustomerService = {
  createCustomer,
  editCustomer,
  deleteCustomer,
  getCustomer,
  getCustomerList,
  getCustomerByName,
};

export default CustomerService;
