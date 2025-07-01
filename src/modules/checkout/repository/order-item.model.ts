import { v4 as uuidv4 } from 'uuid';
import { BelongsTo, Column, DataType, Default, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";

import { OrderModel } from "./order.model";

@Table({
  tableName: "order_items",
  timestamps: false,
})
export class OrderItemModel extends Model<OrderItemModel> {

  @PrimaryKey
  @Default(uuidv4)
  @Column({ type: DataType.STRING,  allowNull: false, field: 'id', })
  declare id: string;

  @ForeignKey(() => OrderModel)
  @Column({ type: DataType.STRING, allowNull: false, field: 'order_id', })
  declare orderId: string;

  @BelongsTo(() => OrderModel)
  declare order: Awaited<OrderModel>;

  @Column({ type: DataType.STRING, allowNull: false, field: 'product_id', })
  declare productId: string;

  @Column({ type: DataType.STRING, allowNull: false, field: 'name', })
  declare name: string;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false, field: 'price' })
  declare price: number;

  @Column({ type: DataType.INTEGER, allowNull: false, field: 'quantity', })
  declare quantity: number;
}