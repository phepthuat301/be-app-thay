import { Entity, Column } from 'typeorm';

import { ModelEntity } from './model';
import { CUSTOMER_STATUS_ENUM, GENDER } from 'share/enum';

@Entity('customer')
export class Customer extends ModelEntity {
  @Column({
    nullable: false,
    length: 255,
  })
  name: string;

  @Column({
    nullable: true
  })
  date_of_birth: Date;

  @Column({
    nullable: true,
    length: 255,
  })
  address: string;

  @Column({
    nullable: true,
    length: 255,
  })
  phone: string;

  @Column({
    nullable: true,
  })
  gender: GENDER;

  @Column({
    nullable: true,
  })
  status: CUSTOMER_STATUS_ENUM;

  @Column({})
  note: string;

  @Column({
    nullable: true,
  })
  referral_code: string;

  @Column({
    nullable: true,
  })
  pathological: string;

  @Column({
    nullable: true,
    default: 0,
  })
  reward_point: number;
}
