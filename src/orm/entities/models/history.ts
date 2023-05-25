import { Entity, Column } from 'typeorm';

import { ModelEntity } from './model.entity';

@Entity('History')
export class History extends ModelEntity {
  @Column({
    nullable: true,
    unique: true,
  })
  order_id: string;

  @Column({ nullable: true })
  treatment_progress: number;

  @Column({
    nullable: true,
  })
  pay_date: Date;

  @Column({ nullable: true, type: 'numeric', precision: 10, scale: 2, default: 0 })
  price: number;
}
