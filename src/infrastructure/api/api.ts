import dotenv from 'dotenv';
import express from 'express';
import productRoutes from './../../routes/products.routes';
import clientsRoutes from './../../routes/clients.routes';
import checkoutRoutes from './../../routes/checkout.routes';
import invoiceRoutes from './../../routes/invoice.routes';
import { globalErrorHandler } from '../error-handler/global-error-handler';

dotenv.config();

const api = express();

api.use(express.json());

api.use('/products', productRoutes);
api.use('/clients', clientsRoutes);
api.use('/checkout', checkoutRoutes);
api.use('/invoice', invoiceRoutes);

api.use(globalErrorHandler);

export default api;