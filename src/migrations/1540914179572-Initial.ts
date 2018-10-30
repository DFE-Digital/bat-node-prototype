import {MigrationInterface, QueryRunner} from "typeorm";

export class Initial1540914179572 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "site" ("id" SERIAL NOT NULL, "providerId" integer NOT NULL, "locationName" character varying NOT NULL, "address" character varying NOT NULL, "code" character varying(1) NOT NULL, CONSTRAINT "PK_635c0eeabda8862d5b0237b42b4" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE "site"`);
    }

}
