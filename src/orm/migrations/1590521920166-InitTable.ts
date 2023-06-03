import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsers1590521920166 implements MigrationInterface {
  name = 'CreateUsers1590521920166';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "admin" (
        "id" SERIAL PRIMARY KEY,
        "email" character varying(255) NOT NULL UNIQUE,
        "password" character varying(255) NOT NULL,
        "username" character varying(255),
        "role" character varying(30) DEFAULT 'ADMINISTATOR',
        "phone" character varying(255),
        "status" character varying(255),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now()
    )`,
    );

    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "customer" (
        "id" SERIAL PRIMARY KEY,
        "name" character varying(255) NOT NULL,
        "date_of_birth" date,
        "address" character varying(255),
        "phone" character varying(255) NOT NULL,
        "gender" character varying,
        "note" character varying,
        "status" character varying,
        "refferal_code" character varying NOT NULL,
        "pathological" character varying,
        "reward_point" integer DEFAULT 0,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now()
    )`,
    );

    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "item" (
        "id" SERIAL PRIMARY KEY,
        "code" character varying(255),
        "name" character varying,
        "status" character varying,
        "price" numeric(10,2) DEFAULT 0,
        "payment" character varying,
        "reward_point" integer,
        "number_of_treatments" integer,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now()
    )`,
    );

    await queryRunner.query(
      ` CREATE TABLE IF NOT EXISTS "orders" (
        "id" SERIAL PRIMARY KEY,
        "client_id" integer,
        "item_id" integer,
        "total_treatment" integer,
        "price" numeric(10,2) DEFAULT 0,
        "paid" numeric(10,2) DEFAULT 0,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now()
    )`,
    );

    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "history" (
        "id" SERIAL PRIMARY KEY,
        "order_id" integer,
        "treatment_progress" integer,
        "pay_date" date,
        "price" numeric(10,2) DEFAULT 0, 
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now()
    )`,
    );

    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "configuration" (
        "id" SERIAL PRIMARY KEY,
        "key" character varying NOT NULL,
        "value" character varying NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now()
      )`,
    );

    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "referral" (
        "id" SERIAL PRIMARY KEY,
        "referee_id" integer NOT NULL,
        "referrer_id" integer NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now()
      )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`, undefined);
  }
}
