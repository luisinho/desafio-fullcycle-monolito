import { Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({
    modelName: 'products-sale',
    tableName: 'products',
    timestamps: false,
})
export class StoreCatalogProductModel extends Model<StoreCatalogProductModel> {

    @PrimaryKey
    @Column({ type: DataType.STRING,  allowNull: false, field: 'id', })
    declare id: string;

    @Column({ type: DataType.STRING,  allowNull: false, field: 'name', })
    declare name: string;

    @Column({ type: DataType.STRING,  allowNull: false, field: 'description', })
    declare description: string;

    @Column({ type: DataType.DECIMAL(10,2),  allowNull: false, field: 'sales_price', })
    declare salesPrice: number;
}