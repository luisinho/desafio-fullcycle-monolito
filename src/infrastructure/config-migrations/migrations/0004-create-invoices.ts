// src/infrastructure/config-migrations/migrations/0004-create-invoices.ts

import { MigrationFn } from 'umzug';
import { DataTypes, Sequelize } from 'sequelize';

export const up: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().createTable('invoices', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      field: 'id',
    },
    name: {
      type: DataTypes.STRING(80),
      allowNull: false,
      field: 'name',
    },
    document: {
      type: DataTypes.STRING(14),
      allowNull: false,
      field: 'document',
    },
    street: {
      type: DataTypes.STRING(30),
      allowNull: false,
      field: 'street',
    },
    number: {
      type: DataTypes.STRING(10),
      allowNull: false,
      field: 'number',
    },
    complement: {
      type: DataTypes.STRING(10),
      allowNull: false,
      field: 'complement',
    },
    city: {
      type: DataTypes.STRING(30),
      allowNull: false,
      field: 'city',
    },
    state: {
      type: DataTypes.STRING(30),
      allowNull: false,
      field: 'state',
    },
    zipCode: {
      type: DataTypes.STRING(9),
      allowNull: false,
      field: 'zipCode',
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
  await sequelize.getQueryInterface().dropTable('invoices');
};
