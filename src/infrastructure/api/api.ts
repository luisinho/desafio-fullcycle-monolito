import dotenv from 'dotenv';
import express from 'express';
import productRoutes from './../../routes/products.routes';
import clientsRoutes from './../../routes/clients.routes';
import checkoutRoutes from './../../routes/checkout.routes';
import invoiceRoutes from './../../routes/invoice.routes';
import { dbLojaSequelize } from '../../infrastructure/db/database';
import { globalErrorHandler } from '../error-handler/global-error-handler';

dotenv.config();

const api = express();

api.use(express.json());

api.use(productRoutes);
api.use(clientsRoutes);
api.use(checkoutRoutes);
api.use(invoiceRoutes);

api.use(globalErrorHandler);

export async function initApi() {
  await dbLojaSequelize.sync({ force: true });
  return api;
}    
    
export default api;