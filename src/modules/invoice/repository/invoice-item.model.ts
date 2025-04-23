import { BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';

import { InvoiceModel } from './invoice.model';

@Table({
  tableName: 'invoice_items',
  timestamps: false,
})
export default class InvoiceItemModel extends Model<InvoiceItemModel> {

    @PrimaryKey
    @Column({ type: DataType.STRING,  allowNull: false, field: 'id', })
    declare id: string;

    @Column({ type: DataType.STRING,  allowNull: false, field: 'name', })
    declare name: string;

    @Column({ type: DataType.NUMBER,  allowNull: false, field: 'price', })
    declare price: number;

    @ForeignKey(() => InvoiceModel)
    @Column({ type: DataType.STRING,  allowNull: false, field: 'invoice_id', })
    declare invoiceId: string;

    @BelongsTo(() => InvoiceModel)
    declare invoice: Awaited<InvoiceModel>;
}
  