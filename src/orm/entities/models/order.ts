import { Entity, Column } from 'typeorm';

import { ModelEntity } from './model.entity';

@Entity('Order')
export class Order extends ModelEntity {
  @Column({
    nullable: true,
    unique: true,
  })
  client_id: string;

  @Column({
    nullable: true,
    unique: true,
  })
  item_id: string;

  @Column({ nullable: true })
  treatment_progress: number;

  @Column({ nullable: true, type: 'numeric', precision: 10, scale: 2, default: 0 })
  price: number;

  @Column({ nullable: true, type: 'numeric', precision: 10, scale: 2, default: 0 })
  paid: number;
}
