import { Column, HasMany, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";

import OrderItemModel from "../repository/order-item.model";

 @Table({
    tableName: 'orders',
    timestamps: false,
})
export default class OrderModel extends Model<OrderModel> {

    @PrimaryKey
    @Column({ type: DataType.STRING, allowNull: false, field: 'id', })
    declare id: string

    @Column({ type: DataType.STRING(200), allowNull: false, field: 'invoice_id', })
    declare invoiceId: string;    

    @Column({ type: DataType.STRING(10), allowNull: false, field: 'status', })
    declare status: string;

    @Column({ type: DataType.DECIMAL(10, 2),  allowNull: false, field: 'total', })
    declare total: number;

    @Column({ type: DataType.STRING, allowNull: false, field: 'client_id' })
    declare clientId: string;

    @HasMany(() => OrderItemModel)
    declare orderItems: OrderItemModel[];
}