import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBloodSugarCol1705232731260 implements MigrationInterface {
  name = 'AddBloodSugarCol1705232731260';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add fields to the existing "users" table
    await queryRunner.query(
      `ALTER TABLE "bloodsugar"
        ADD COLUMN "test_time" TIMESTAMP;
      `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Reverse the changes made in the "up" method
    await queryRunner.query(
      `ALTER TABLE "bloodsugar"
        DROP COLUMN "test_time"`,
    );
  }
}
