import { Column, DataType, Model, PrimaryKey, Table } from 'sequelize-typescript';

@Table({
    tableName: 'transactions',
    timestamps: false,
 })
export default class TransactionModel extends Model<TransactionModel> {

    @PrimaryKey
    @Column({ type: DataType.STRING,  allowNull: false, field: 'id', })
    declare id: string;

    @Column({ type: DataType.NUMBER, allowNull: false, field: 'amount', })
    declare amount: number;

    @Column({ type: DataType.STRING(20), allowNull: false, field: 'order_id', })
    declare orderId: string;

    @Column({ type: DataType.STRING(10), allowNull: false, field: 'status', })
    declare status: string;

    @Column({ type: DataType.DATE, allowNull: false, field: 'created_at', })
    declare createdAt: Date;

    @Column({ type: DataType.DATE, allowNull: false, field: 'updated_at', })
    declare updatedAt: Date;
  }