import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { Length } from "class-validator";

@Entity()
export default class Site {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "provider_id" })
  providerId: number;

  @Length(1, 50)
  @Column({ name: "location_name" })
  locationName: string;

  @Column()
  address1: string;

  @Column()
  address2: string;

  @Column()
  address3: string;

  @Column()
  address4: string;

  @Column()
  postcode: string;

  @Column({ length: 1 })
  code: string;
}
