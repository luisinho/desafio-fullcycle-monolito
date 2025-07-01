import dotenv from "dotenv";
import express from "express";
import clientsRoutes from "./../../routes/clients.routes";
import invoiceRoutes from "./../../routes/invoice.routes";
import productRoutes from "./../../routes/products.routes";
import checkoutRoutes from "./../../routes/checkout.routes";
import storeCatalogRoutes from "./../../routes/store-catalog.routes";
import { globalErrorHandler } from "../error-handler/global-error-handler";

dotenv.config();

export function createApi() {

   const api = express();

   api.use(express.json());

   api.use(productRoutes);
   api.use(clientsRoutes);
   api.use(checkoutRoutes);
   api.use(invoiceRoutes);
   api.use(storeCatalogRoutes);

   api.use(globalErrorHandler);

   return api;
}