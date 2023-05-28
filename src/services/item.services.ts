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
  // const itemToUpdate = await itemRepository.findOne({ where: { id: item.id } });
  // if (!itemToUpdate) {
  //   throw new Error('Item not found');
  // }
  // itemToUpdate.name = item.name;
  // itemToUpdate.price = item.price;
  // itemToUpdate.reward_point = item.reward_point;
  // itemToUpdate.number_of_treatments = item.number_of_treatments;
  // await itemRepository.save(itemToUpdate);
  // return itemToUpdate;

  const result = await itemRepository
    .createQueryBuilder()
    .update(Item)
    .set({
      name: item.name,
      price: item.price,
      reward_point: item.reward_point,
      number_of_treatments: item.number_of_treatments,
    })
    .where('id = :id', { id: item.id })
    .execute();
  return result;
};
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
