import { Entity, Column } from 'typeorm';

import { ModelEntity } from './model';

@Entity('referral')
export class Referral extends ModelEntity {
  @Column({
    nullable: false,
  })
  referee_id: number;

  @Column({
    nullable: false,
  })
  referrer_id: number;
}
