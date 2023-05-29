import { randomUUID } from 'crypto';
import { Item } from 'orm/entities/models/item';
import { ITEM_STATUS_ENUM } from 'share/enum';
import { getRepository } from 'typeorm';

export interface ItemPayload {
  id: number;
  name?: string;
  code?: string;
  price?: number;
  reward_point?: number;
  number_of_treatments?: number;
  status?: ITEM_STATUS_ENUM;
}

const createItem = async (name: string, price: number, reward_point: number, number_of_treatments: number) => {
  const itemRepository = getRepository(Item);

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
const editItem = async (item: ItemPayload) => {
  const itemRepository = getRepository(Item);

  const updateFields: Partial<Item> = {};

  if (item.name) {
    updateFields.name = item.name;
  }
  if (item.price) {
    updateFields.price = item.price;
  }
  if (item.reward_point) {
    updateFields.reward_point = item.reward_point;
  }
  if (item.number_of_treatments) {
    updateFields.number_of_treatments = item.number_of_treatments;
  }
  if (item.status) {
    updateFields.status = item.status;
  }

  const result = await itemRepository
    .createQueryBuilder()
    .update(Item)
    .set(updateFields)
    .where('id = :id', { id: item.id })
    .returning('*')
    .execute();
  return result.raw[0];
};
const deleteItem = async (id: number) => {
  const itemRepository = getRepository(Item);
  const item = await itemRepository.findOne({ where: { id } });
  if (!item) {
    throw new Error('Item not found');
  }
  await itemRepository.delete({ id });
};

const getItemList = async () => {
  const itemRepository = getRepository(Item);
  const itemList = await itemRepository.find();
  return itemList;
};

const getItem = async (id: number) => {
  const itemRepository = getRepository(Item);
  const item = await itemRepository.findOne({ where: { id } });
  if (!item) {
    throw new Error('Item not found');
  }
  return item;
};

const getItemByName = async (keyword: string, page: number, litmit: number) => {
  const itemRepository = getRepository(Item);
  const item = await itemRepository.find({
    where: { name: keyword },
    skip: (page - 1) * litmit,
    take: litmit,
  });
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
  getItemByName,
  getItemList,
};

export default ItemService;
