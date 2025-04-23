import { Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({
  tableName: "products",
  timestamps: false,
})
export class ProductModel extends Model<ProductModel> {

  @PrimaryKey
  @Column({ type: DataType.STRING,  allowNull: false, field: 'id', })
  declare id: string;

  @Column({ type: DataType.STRING,  allowNull: false, field: 'name', })
  declare name: string;

  @Column({ type: DataType.STRING,  allowNull: false, field: 'description', })
  declare description: string;

  @Column({ type: DataType.NUMBER,  allowNull: false, field: 'purchase_price', })
  declare purchasePrice: number;

  @Column({ type: DataType.NUMBER,  allowNull: false, field: 'stock', })
  declare stock: number;

  @Column({ type: DataType.DATE,  allowNull: false, field: 'created_at', })
  declare createdAt: Date;

  @Column({ type: DataType.DATE,  allowNull: false, field: 'updated_at', })
  declare updatedAt: Date;
}