import { MigrationFn } from 'umzug';
import { DataTypes, Sequelize } from 'sequelize';

export const up: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().createTable('products', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        field: 'id',
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: 'name',
      },
      description: {
        type: DataTypes.STRING(60),
        allowNull: false,
        field: 'description',
      },
      purchase_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: 'purchase_price',
      },
      sales_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: 'sales_price',
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'stock',
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'created_at',
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'updated_at',
      },
  });
};

export const down: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().dropTable('products');
}