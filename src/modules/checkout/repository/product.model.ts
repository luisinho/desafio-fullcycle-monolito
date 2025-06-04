import { BelongsTo, Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";

import OrderModel from "../repository/order.model";

@Table({
    modelName: 'orders-products',
    tableName: 'products',
    timestamps: false,
})
export default class ProductModel extends Model<ProductModel> {

    @PrimaryKey
    @Column({ type: DataType.STRING,  allowNull: false, field: 'id', })
    declare id: string;

    @Column({ type: DataType.STRING,  allowNull: false, field: 'name', })
    declare name: string;

    @Column({ type: DataType.STRING,  allowNull: false, field: 'description', })
    declare description: string;

    @Column({ type: DataType.DECIMAL(10,2),  allowNull: false, field: 'sales_price', })
    declare salesPrice: number;

    //@BelongsTo(() => OrderModel)
    //declare order: Awaited<OrderModel>;
}