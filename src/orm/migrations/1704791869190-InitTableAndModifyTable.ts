import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitTableAndModifyTable1704791869190 implements MigrationInterface {
  name = 'InitTableAndModifyTable1704791869190';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add fields to the existing "users" table
    await queryRunner.query(
      `ALTER TABLE "users"
        ADD COLUMN "avatar" character varying(255),
        ADD COLUMN "liver_enzyme_test_result_image" character varying(255),
        ADD COLUMN "diabetic_test_result_image" character varying(255),
        ADD COLUMN "year_of_birth" character varying(255)`,
    );

    // Create the "account_action_log" table
    await queryRunner.query(
      `CREATE TABLE "account_action_log" (
        "id" SERIAL PRIMARY KEY,
        "user_id" INT,
        "action_type" character varying(255),
        "status" character varying(255),
        "payload_forgot_method" character varying(255),
        "payload_old_password" character varying(255),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now()
      )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Reverse the changes made in the "up" method
    await queryRunner.query(
      `ALTER TABLE "users"
        DROP COLUMN "avatar",
        DROP COLUMN "liver_enzyme_test_result_image",
        DROP COLUMN "diabetic_test_result_image",
        DROP COLUMN "year_of_birth"`,
    );

    // Drop the "account_action_log" table
    await queryRunner.query(`DROP TABLE "account_action_log"`);
  }
}
