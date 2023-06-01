import { randomUUID } from 'crypto';
import { Item } from 'orm/entities/models/item';
import { ITEM_STATUS_ENUM, PAYMENT_ENUM } from 'share/enum';
import { getRepository } from 'typeorm';

export interface ItemPayload {
  id: number;
  name?: string;
  code?: string;
  price?: number;
  reward_point?: number;
  payment_method?: PAYMENT_ENUM;
  number_of_treatments?: number;
  status?: ITEM_STATUS_ENUM;
}

export class ItemService {
  private static instance: ItemService;

  public static getInstance(): ItemService {
    if (!ItemService.instance) {
      ItemService.instance = new ItemService();
    }

    return ItemService.instance;
  }

  createItem = async (
    name: string,
    price: number,
    reward_point: number,
    number_of_treatments: number,
    code: string,
    payment_method: PAYMENT_ENUM,
  ) => {
    const itemRepository = getRepository(Item);

    const oldItem = await itemRepository.findOne({ where: { code } });
    if (oldItem) {
      throw new Error('Item already exists');
    }

    const newItem = new Item();
    newItem.name = name;
    newItem.status = ITEM_STATUS_ENUM.ACTIVE;
    newItem.code = code;
    newItem.price = price;
    newItem.payment = payment_method;
    newItem.reward_point = reward_point;
    newItem.number_of_treatments = number_of_treatments;
    await itemRepository.save(newItem);
    return newItem;
  };

  editItem = async (item: ItemPayload) => {
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

  deleteItem = async (id: number) => {
    const itemRepository = getRepository(Item);
    const item = await itemRepository.findOne({ where: { id } });
    if (!item) {
      throw new Error('Item not found');
    }
    await itemRepository.delete({ id });
  };

  getItemList = async () => {
    const itemRepository = getRepository(Item);
    const itemList = await itemRepository.find();
    return itemList;
  };

  getItem = async (id: number) => {
    const itemRepository = getRepository(Item);
    const item = await itemRepository.findOne({ where: { id } });
    if (!item) {
      throw new Error('Item not found');
    }
    return item;
  };

  getItemByName = async (keyword: string, page: number, litmit: number) => {
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
}
