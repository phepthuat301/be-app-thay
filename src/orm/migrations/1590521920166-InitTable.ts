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
        "name" character varying(255),
        "date_of_birth" date NOT NULL,
        "address" character varying(255),
        "phone" character varying(255),
        "gender" character varying,
        "note" character varying NOT NULL,
        "status" character varying,
        "refferal_code" character varying,
        "pathological" character varying NOT NULL,
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
      ` CREATE TABLE IF NOT EXISTS "order" (
        "id" SERIAL PRIMARY KEY,
        "client_id" integer,
        "item_id" integer,
        "treatment_progress" integer,
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
      `CREATE TABLE IF NOT EXITS "configuration" (
        "id" SERIAL PRIMARY KEY,
        "key" character varying NOT NULL,
        "value" character varying NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now()
      )`,
    );

    await queryRunner.query(
      `CREATE TABLE IF NOT EXITS "referral" (
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
