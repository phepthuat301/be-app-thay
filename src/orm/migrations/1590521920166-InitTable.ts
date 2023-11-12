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

    // await queryRunner.query(
    //   `CREATE TABLE IF NOT EXISTS "item" (
    //     "id" SERIAL PRIMARY KEY,
    //     "code" VARCHAR(255) UNIQUE NOT NULL,
    //     "name" VARCHAR NOT NULL,
    //     "status" VARCHAR NOT NULL,
    //     "price" NUMERIC(10, 2),
    //     "payment" VARCHAR NOT NULL,
    //     "reward_point" INTEGER,
    //     "number_of_treatments" INTEGER,
    //     "created_at" TIMESTAMP NOT NULL DEFAULT now(),
    //     "updated_at" TIMESTAMP NOT NULL DEFAULT now()
    // )`,
    // );

    // await queryRunner.query(
    //   ` CREATE TABLE IF NOT EXISTS "orders" (
    //     "id" SERIAL PRIMARY KEY,
    //     "client_id" integer,
    //     "item_id" integer,
    //     "total_treatment" integer,
    //     "price" numeric(10,2) DEFAULT 0,
    //     "refund_amount" numeric(10,2) DEFAULT 0,
    //     "created_at" TIMESTAMP NOT NULL DEFAULT now(),
    //     "updated_at" TIMESTAMP NOT NULL DEFAULT now()
    // )`,
    // );

    // await queryRunner.query(
    //   `CREATE TABLE IF NOT EXISTS "history" (
    //     "id" SERIAL PRIMARY KEY,
    //     "order_id" integer,
    //     "treatment_progress" integer,
    //     "pay_date" date,
    //     "price" numeric(10,2) DEFAULT 0, 
    //     "created_at" TIMESTAMP NOT NULL DEFAULT now(),
    //     "updated_at" TIMESTAMP NOT NULL DEFAULT now()
    // )`,
    // );

    // await queryRunner.query(
    //   `CREATE TABLE IF NOT EXISTS "configuration" (
    //     "id" SERIAL PRIMARY KEY,
    //     "key" character varying NOT NULL,
    //     "value" character varying NOT NULL,
    //     "created_at" TIMESTAMP NOT NULL DEFAULT now(),
    //     "updated_at" TIMESTAMP NOT NULL DEFAULT now()
    //   )`,
    // );

    // await queryRunner.query(
    //   `CREATE TABLE IF NOT EXISTS "referral" (
    //     "id" SERIAL PRIMARY KEY,
    //     "referee_id" integer NOT NULL,
    //     "referrer_id" integer NOT NULL,
    //     "created_at" TIMESTAMP NOT NULL DEFAULT now(),
    //     "updated_at" TIMESTAMP NOT NULL DEFAULT now()
    //   )`,
    // );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`, undefined);
  }
}
