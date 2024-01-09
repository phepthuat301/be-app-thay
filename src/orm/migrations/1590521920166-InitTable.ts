import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsers1590521920166 implements MigrationInterface {
  name = 'CreateUsers1590521920166';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "users" (
        "id" SERIAL PRIMARY KEY,
        "email" character varying(255) NOT NULL UNIQUE,
        "password" character varying(255) NOT NULL,
        "username" character varying(255),
        "name" character varying(255),
        "gender" character varying(255),
        "role" character varying(30) DEFAULT 'ADMINISTATOR',
        "phone" character varying(255) NOT NULL UNIQUE,
        "status" character varying(255),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now()
    )`,
    );

    await queryRunner.query(
      `CREATE TABLE "bloodsugar" (
        "id" SERIAL PRIMARY KEY,
        "user_id" INT,
        "test_date" DATE,
        "blood_sugar_level" NUMERIC(5, 2),
        "image_url" VARCHAR(255),
        "note" TEXT,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now()
    )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`, undefined);
  }
}
