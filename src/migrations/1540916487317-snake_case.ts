import {MigrationInterface, QueryRunner} from "typeorm";

export class snakeCase1540916487317 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "site" RENAME COLUMN "providerId" TO "provider_id"`);
        await queryRunner.query(`ALTER TABLE "site" RENAME COLUMN "locationName" TO "location_name"`);
        await queryRunner.query(`ALTER TABLE "site" ADD "postcode" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "site" DROP COLUMN "postcode"`);
        await queryRunner.query(`ALTER TABLE "site" RENAME COLUMN "provider_id" TO "providerId"`);
        await queryRunner.query(`ALTER TABLE "site" RENAME COLUMN "location_name" TO "locationName"`);
    }
    
}
