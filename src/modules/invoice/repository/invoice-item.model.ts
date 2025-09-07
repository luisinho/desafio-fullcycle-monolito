import { v4 as uuidv4 } from 'uuid';
import { BelongsTo, Column, DataType, Default, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";

import { InvoiceModel } from "./invoice.model";

@Table({
  tableName: 'invoice_items',
  timestamps: false,
})
export class InvoiceItemModel extends Model<InvoiceItemModel> {

    @PrimaryKey
    @Default(uuidv4)
    @Column({ type: DataType.STRING,  allowNull: false, field: 'id', })
    declare id: string;

    @Column({ type: DataType.STRING,  allowNull: false, field: 'name', })
    declare name: string;

    @Column({ type: DataType.DECIMAL(10, 2),  allowNull: false, field: 'price', })
    declare price: number;

    @ForeignKey(() => InvoiceModel)
    @Column({ type: DataType.STRING,  allowNull: false, field: 'invoice_id', })
    declare invoiceId: string;

    @BelongsTo(() => InvoiceModel)
    declare invoice: Awaited<InvoiceModel>;

    @Column({ type: DataType.INTEGER, allowNull: false, field: 'quantity', })
    declare quantity: number;

    /*@Column({ type: DataType.DATE,  allowNull: false, field: 'created_at', })
    declare createdAt: Date;
    
    @Column({ type: DataType.DATE,  allowNull: false, field: 'updated_at', })
    declare updatedAt: Date;*/
}