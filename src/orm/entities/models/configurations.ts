import { Entity, Column } from 'typeorm';

import { ModelEntity } from './model';

@Entity('configuration')
export class Configuration extends ModelEntity {
  @Column({
    nullable: false,
  })
  key: string;

  @Column({
    nullable: false,
  })
  value: string;
}
