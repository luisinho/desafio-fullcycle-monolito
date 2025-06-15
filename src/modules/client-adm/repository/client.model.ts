import { Table, Column, Model, PrimaryKey, DataType } from 'sequelize-typescript';

 @Table({
    tableName: 'clients',
    timestamps: false,
})
export class ClientModel extends Model<ClientModel> {

    @PrimaryKey
    @Column({ type: DataType.STRING, allowNull: false, field: 'id', })
    declare id: string;

    @Column({ type: DataType.STRING(80), allowNull: false, field: 'name', })
    declare name: string;

    @Column({ type: DataType.STRING(100), allowNull: false, field: 'email', })
    declare email: string;

    @Column({ type: DataType.STRING(4), allowNull: false, field: 'documentType', })
    declare documentType: string;

    @Column({ type: DataType.STRING(14), allowNull: false, field: 'document', })
    declare document: string;

    @Column({ type: DataType.STRING(30), allowNull: false, field: 'street', })
    declare street: string;

    @Column({ type: DataType.STRING(10), allowNull: false, field: 'number', })
    declare number: string;

    @Column({ type: DataType.STRING(10), allowNull: false, field: 'complement', })
    declare complement: string;

    @Column({ type: DataType.STRING(30), allowNull: false, field: 'city', })
    declare city: string;

    @Column({ type: DataType.STRING(30), allowNull: false, field: 'state', })
    declare state: string;

    @Column({ type: DataType.STRING(9), allowNull: false, field: 'zipCode', })
    declare zipCode: string;

    @Column({ type: DataType.DATE, allowNull: false, field: 'created_at', })
    declare createdAt: Date;

    @Column({ type: DataType.DATE, allowNull: false, field: 'updated_at', })
    declare updatedAt: Date;
}