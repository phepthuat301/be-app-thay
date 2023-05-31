import { Entity, Column } from 'typeorm';

import { ModelEntity } from './model';
import { ITEM_STATUS_ENUM, PAYMENT_ENUM } from 'share/enum';

@Entity('item')
export class Item extends ModelEntity {
  @Column({
    nullable: true,
    unique: true,
  })
  code: string;

  @Column({ nullable: true })
  name: string;

  @Column({
    nullable: true,
  })
  status: ITEM_STATUS_ENUM;

  @Column({
    nullable: true,
  })
  payment: PAYMENT_ENUM;

  @Column({ nullable: true, type: 'numeric', precision: 10, scale: 2, default: 0 })
  price: number;

  @Column({
    nullable: true,
  })
  reward_point: number;

  @Column({
    nullable: true,
  })
  number_of_treatments: number;
}
