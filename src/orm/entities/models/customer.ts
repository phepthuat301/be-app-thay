import { Entity, Column } from 'typeorm';

import { ModelEntity } from './model';
import { CUSTOMER_STATUS_ENUM, GENDER } from 'share/enum';

@Entity('customer')
export class Customer extends ModelEntity {
  @Column({
    nullable: true,
    length: 255,
  })
  name: string;

  @Column({})
  date_of_birth: Date;

  @Column({
    nullable: true,
    length: 255,
  })
  address: string;

  @Column({
    nullable: false,
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
  refferal_code: string;

  @Column({})
  pathological: string;

  @Column({
    nullable: true,
    default: 0,
  })
  reward_point: number;
}
