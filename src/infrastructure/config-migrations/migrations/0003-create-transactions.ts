// src/infrastructure/config-migrations/migrations/0003-create-transactions.ts

import { MigrationFn } from 'umzug';
import { DataTypes, Sequelize } from 'sequelize';

export const up: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().createTable('transactions', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      field: 'id',
    },
    amount: {
      type: DataTypes.FLOAT, // Usar FLOAT ou DECIMAL, dependendo da precisão desejada
      allowNull: false,
      field: 'amount',
    },
    order_id: {
      type: DataTypes.STRING(20),
      allowNull: false,
      field: 'order_id',
    },
    status: {
      type: DataTypes.STRING(10),
      allowNull: false,
      field: 'status',
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
  await sequelize.getQueryInterface().dropTable('transactions');
};
