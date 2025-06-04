import { Column, DataType, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";

import OrderModel from "../repository/order.model";

 @Table({
    tableName: 'orders-clients',
    timestamps: false,
})
export default class ClientModel extends Model<ClientModel> {

    @PrimaryKey
    @Column({ type: DataType.STRING, allowNull: false, field: 'id', })
    declare id: string;

    @Column({ type: DataType.STRING(80), allowNull: false, field: 'name', })
    declare name: string;

    @Column({ type: DataType.STRING(100), allowNull: false, field: 'email', })
    declare email: string;

    @Column({ type: DataType.STRING(4), allowNull: false, field: 'documentType', })
    declare documentType: string;

    @Column({ type: DataType.STRING(14), allowNull: false, field: 'document', })
    declare document: string;

    @HasMany(() => OrderModel)
    declare orders: OrderModel[];
}