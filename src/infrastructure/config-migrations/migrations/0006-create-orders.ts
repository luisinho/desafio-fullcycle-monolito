// src/infrastructure/config-migrations/migrations/0006-create-orders.ts

import { MigrationFn } from 'umzug';
import { DataTypes, Sequelize } from 'sequelize';

export const up: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().createTable('orders', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      field: 'id',
    },
    invoice_id: {
      type: DataTypes.STRING(200),
      allowNull: false,
      field: 'invoice_id',
    },
    status: {
      type: DataTypes.STRING(10),
      allowNull: false,
      field: 'status',
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'total',
    },
    client_id: {
      type: DataTypes.STRING(200),
      allowNull: false,
      field: 'client_id',
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
  await sequelize.getQueryInterface().dropTable('orders');
};
