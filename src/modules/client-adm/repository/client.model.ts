import { Table, Column, Model, PrimaryKey, DataType } from 'sequelize-typescript';

 @Table({
    tableName: 'clients',
    timestamps: false,
})
export class ClientModel extends Model<ClientModel> {

    @PrimaryKey
    @Column({ type: DataType.STRING, allowNull: false, field: 'id', })
    declare id: string;

    @Column({ type: DataType.STRING, allowNull: false, field: 'name', })
    declare name: string;

    @Column({ type: DataType.STRING, allowNull: false, field: 'email', })
    declare email: string;

    @Column({ type: DataType.STRING, allowNull: false, field: 'address', })
    declare address: string;

    @Column({ type: DataType.DATE, allowNull: false, field: 'created_at', })
    declare createdAt: Date;

    @Column({ type: DataType.DATE, allowNull: false, field: 'updated_at', })
    declare updatedAt: Date;
  }