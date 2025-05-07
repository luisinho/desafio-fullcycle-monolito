import path from 'path';
import { Sequelize } from 'sequelize-typescript';
import { ClientModel } from '../../modules/client-adm/repository/client.model';
import { InvoiceModel } from '../../modules/invoice/repository/invoice.model';
import TransactionModel from '../../modules/payment/repository/transaction.model';
import { ProductModel } from '../../modules/product-adm/repository/product.model';
import InvoiceItemModel from '../../modules/invoice/repository/invoice-item.model';

export const dbLojaSequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.DB_STORAGE || 'db-loja.sqlite',
  // storage: path.resolve(__dirname, '..', '..', 'db-loja.sqlite'),
  models: [ClientModel, InvoiceModel, InvoiceItemModel, ProductModel, TransactionModel],  
  logging: false,
});