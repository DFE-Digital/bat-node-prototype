import {MigrationInterface, QueryRunner} from "typeorm";

export class BreakUpAddress1540914935176 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "site" rename COLUMN "address" TO "address1"`);
        await queryRunner.query(`ALTER TABLE "site" ADD "address2" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "site" ADD "address3" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "site" ADD "address4" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "site" DROP COLUMN "address4"`);
        await queryRunner.query(`ALTER TABLE "site" DROP COLUMN "address3"`);
        await queryRunner.query(`ALTER TABLE "site" DROP COLUMN "address2"`);
        await queryRunner.query(`ALTER TABLE "site" RENAME COLUMN "address1" TO "address"`);
    }

}
