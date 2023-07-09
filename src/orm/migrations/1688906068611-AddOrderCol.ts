import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOrderCol1688906068611 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE orders ADD COLUMN refund_amount INTEGER`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE orders DROP refund_amount`);
  }
}
