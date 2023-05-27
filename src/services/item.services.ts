import { randomUUID } from 'crypto';
import { Item } from 'orm/entities/models/item';
import { ITEM_STATUS_ENUM } from 'share/enum';
import { getRepository } from 'typeorm';

const createItem = async (name: string, price: number, reward_point: number, number_of_treatments: number) => {
  const itemRepository = getRepository(Item);
  const item = await itemRepository.findOne({ where: { name } });
  if (item) {
    throw new Error('Item already exists');
  }

  const newItem = new Item();
  newItem.name = name;
  newItem.status = ITEM_STATUS_ENUM.ACTIVE;
  newItem.code = randomUUID();
  newItem.price = price;
  newItem.reward_point = reward_point;
  newItem.number_of_treatments = number_of_treatments;
  await itemRepository.save(newItem);
  return newItem;
};
const editItem = async (id: number, name: string, status: ITEM_STATUS_ENUM, reward_point: number) => {};
const deleteItem = async (id: number) => {
  const itemRepository = getRepository(Item);
  const item = await itemRepository.findOne({ where: { id } });
  if (!item) {
    throw new Error('Item not found');
  }
  await itemRepository.delete({ id });
};

const getItem = async (id: number) => {
  const itemRepository = getRepository(Item);
  const item = await itemRepository.findOne({ where: { id } });
  if (!item) {
    throw new Error('Item not found');
  }
  return item;
};

const ItemService = {
  createItem,
  editItem,
  deleteItem,
  getItem,
};

export default ItemService;
