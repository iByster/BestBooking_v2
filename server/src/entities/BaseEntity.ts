import { CreateDateColumn, UpdateDateColumn, BaseEntity as BaseBaseEntityXD, Column, PrimaryColumn } from "typeorm";

export abstract class BaseEntity extends BaseBaseEntityXD implements BaseEntity {
    @PrimaryColumn('uuid')
    id!: string;

    @CreateDateColumn()
    createdAt?: Date;

    @UpdateDateColumn()
    updatedAt?: Date;
}
