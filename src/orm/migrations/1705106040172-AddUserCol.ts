import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserCol1705106040172 implements MigrationInterface {
  name = 'InitTableAndModifyTable1704791869190';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add fields to the existing "users" table
    await queryRunner.query(
      `ALTER TABLE user
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

    // Drop the "account_action_log" table
    await queryRunner.query(`DROP TABLE "account_action_log"`);
  }
}
