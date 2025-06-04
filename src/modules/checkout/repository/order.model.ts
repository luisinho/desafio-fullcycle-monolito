import { BelongsTo, Column, ForeignKey, DataType, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";

import ClientModel from "../repository/client.model";
import ProductModel from "../repository/product.model";

 @Table({
    tableName: 'orders',
    timestamps: false,
})
export default class OrderModel extends Model<OrderModel> {

    @PrimaryKey
    @Column({ type: DataType.STRING, allowNull: false, field: 'id', })
    declare id: string

    @Column({ type: DataType.STRING(200), allowNull: false, field: 'invoiceId', })
    declare invoiceId: string;

    @Column({ type: DataType.STRING(10), allowNull: false, field: 'status', })
    declare status: string;

    @Column({ type: DataType.DECIMAL(10, 2),  allowNull: false, field: 'total', })
    declare total: number;

    @ForeignKey(() => ClientModel)
    @Column({ type: DataType.STRING, allowNull: false, field: 'client_id' })
    declare clientId: string;

    @BelongsTo(() => ClientModel)
    declare client: ClientModel;

    //@HasMany(() => ProductModel)
    //declare products: ProductModel[];
}