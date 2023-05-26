import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsers1590521920166 implements MigrationInterface {
  name = 'CreateUsers1590521920166';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "admin" (
        "id" SERIAL PRIMARY KEY,
        "email" character varying(255) NOT NULL UNIQUE,
        "password" character varying(255) NOT NULL,
        "username" character varying(255),
        "name" character varying(255),
        "role" character varying(30) DEFAULT 'ADMINISTATOR',
        "phone" character varying(255),
        "status" character varying(255)
    )`,
    );

    await queryRunner.query(
      `CREATE TABLE "Customer" (
        "id" SERIAL PRIMARY KEY,
        "name" character varying(255),
        "dateOfBirth" date NOT NULL,
        "address" character varying(255),
        "phone" character varying(255),
        "gender" character varying,
        "note" character varying NOT NULL,
        "refferal_code" character varying,
        "pathological" character varying NOT NULL,
        "reward_point" integer DEFAULT 0
    )`,
    );

    await queryRunner.query(
      `CREATE TABLE "Item" (
        "id" SERIAL PRIMARY KEY,
        "code" character varying(255),
        "name" character varying,
        "status" character varying,
        "price" numeric(10,2) DEFAULT 0,
        "reward_point" integer,
        "number_of_treatments" integer
    )`,
    );

    await queryRunner.query(
      ` CREATE TABLE "Order" (
        "id" SERIAL PRIMARY KEY,
        "client_id" character varying,
        "item_id" character varying,
        "treatment_progress" integer,
        "price" numeric(10,2) DEFAULT 0,
        "paid" numeric(10,2) DEFAULT 0
    )`,
    );

    await queryRunner.query(
      `CREATE TABLE "History" (
        "id" SERIAL PRIMARY KEY,
        "order_id" character varying,
        "treatment_progress" integer,
        "pay_date" date,
        "price" numeric(10,2) DEFAULT 0
    )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`, undefined);
  }
}
