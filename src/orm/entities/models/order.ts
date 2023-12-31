import { Entity, Column } from 'typeorm';

import { ModelEntity } from './model';

@Entity('orders')
export class Order extends ModelEntity {
  @Column({
    nullable: true,
    unique: true,
  })
  client_id: number;

  @Column({
    nullable: true,
    unique: true,
  })
  item_id: number;

  @Column({ nullable: true })
  total_treatment: number;

  @Column({ nullable: true, type: 'numeric', precision: 10, scale: 2, default: 0 })
  price: number;

  @Column({ nullable: true, type: 'int' })
  unit_price: number;

  @Column({ nullable: true, type: 'numeric', precision: 10, scale: 2, default: 0 })
  refund_amount: number;

}
