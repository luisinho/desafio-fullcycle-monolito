import dotenv from "dotenv";
import express from "express";
import clientsRoutes from "./../../routes/clients.routes";
import invoiceRoutes from "./../../routes/invoice.routes";
import paymentRoutes from "./../../routes/payment.routes";
import productRoutes from "./../../routes/products.routes";
import checkoutRoutes from "./../../routes/checkout.routes";
import storeCatalogRoutes from "./../../routes/store-catalog.routes";
import { globalErrorHandler } from "../error-handler/global-error-handler";

dotenv.config();

export function createApi() {

  const api = express();

  api.use(express.json());

  api.use('/products', productRoutes);
  api.use('/clients', clientsRoutes);
  api.use('/checkout', checkoutRoutes);
  api.use('/invoices', invoiceRoutes);
  api.use('/payment', paymentRoutes);
  api.use('/store-catalog', storeCatalogRoutes);

  api.use(globalErrorHandler);

  return api;
}