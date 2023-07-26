import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddColumn1690374093948 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE item ADD COLUMN unit_price INTEGER`,
    );
    await queryRunner.query(
      `ALTER TABLE history ADD COLUMN unit_price INTEGER`,
    );
    await queryRunner.query(
      `ALTER TABLE orders ADD COLUMN unit_price INTEGER`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE item DROP unit_price`);
    await queryRunner.query(`ALTER TABLE history DROP unit_price`);
    await queryRunner.query(`ALTER TABLE order DROP unit_price`);
  }
}
