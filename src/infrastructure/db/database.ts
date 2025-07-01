import { join } from "path";
import { Sequelize } from "sequelize-typescript";

import { OrderModel } from "../../modules/checkout/repository/order.model";
import { InvoiceModel } from "../../modules/invoice/repository/invoice.model";
import { ClientModel } from "../../modules/client-adm/repository/client.model";
import { ProductModel } from "../../modules/product-adm/repository/product.model";
import { OrderItemModel } from "../../modules/checkout/repository/order-item.model";
import { TransactionModel } from "../../modules/payment/repository/transaction.model";
import { InvoiceItemModel } from "../../modules/invoice/repository/invoice-item.model";
import { StoreCatalogProductModel } from "../../modules/store-catalog/repository/product.model";

export const dbLojaSequelize = new Sequelize({
  dialect: 'sqlite',
  // storage: process.env.DB_STORAGE || 'db-loja.sqlite',
  // storage: path.resolve(__dirname, '..', '..', 'db-loja.sqlite'),
  // host: join(__dirname, '../../../db-loja.sqlite'),
  // storage: join(__dirname, '../../../db-loja.sqlite'),
  storage: join(__dirname, '../../../db-loja.sqlite'),
  models: [ClientModel, InvoiceModel, InvoiceItemModel, OrderModel, OrderItemModel, ProductModel, StoreCatalogProductModel, TransactionModel],
  logging: false,
});

