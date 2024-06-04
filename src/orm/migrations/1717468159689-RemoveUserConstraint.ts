import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveUserConstraint1717468159689 implements MigrationInterface {
  name = 'RemoveUserConstraint1717468159689';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add fields to the existing "users" table
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT users_email_key;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Reverse the changes made in the "up" method
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT users_email_key UNIQUE (email);`,
    );
  }
}
