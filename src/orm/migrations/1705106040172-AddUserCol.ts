import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserCol1705106040172 implements MigrationInterface {
  name = 'AddUserCol1705106040172';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add fields to the existing "users" table
    await queryRunner.query(
      `ALTER TABLE "users"
        ADD COLUMN "is_first_upload" BOOLEAN DEFAULT TRUE NULL;
      `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Reverse the changes made in the "up" method
    await queryRunner.query(
      `ALTER TABLE "users"
        DROP COLUMN "is_first_upload"`,
    );
  }
}
