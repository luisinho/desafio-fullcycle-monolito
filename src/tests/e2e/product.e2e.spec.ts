import { Umzug } from "umzug";
import request from "supertest";
import express, { Express } from 'express'
import { Sequelize } from "sequelize-typescript";

import productRoutes from './../../routes/products.routes';
import { migrator } from "../../infrastructure/config-migrations/migrator";
import { ProductModel } from '../../modules/product-adm/repository/product.model';

jest.setTimeout(30000);

describe("E2E test for product", () => {

    const app: Express = express();
    app.use(express.json());
    app.use("/products", productRoutes);

    let sequelize: Sequelize

    let migration: Umzug<any>;

    beforeEach(async () => {
       sequelize = new Sequelize({
       dialect: 'sqlite',
       storage: ":memory:",
       logging: false,
    });

    sequelize.addModels([ProductModel]);
    migration = migrator(sequelize);
    await migration.up();
   });

   afterEach(async () => {
     if (!migration || !sequelize) {
         return; 
     }
     migration = migrator(sequelize);
     await migration.down();
     await sequelize.close();
   });

   it('should add a products', async () => {

     const response = await request(app)
        .post('/products')
        .send({
          name: 'Notebook dell',
          description: 'Notebook dell 1.0',
          purchasePrice: 800.00,
          stock: 3
      });

      expect(response.status).toBe(201);
      expect(response.body.id).toBeDefined();
      expect(response.body.name).toBe('Notebook dell');
      expect(response.body.description).toBe('Notebook dell 1.0');
      expect(response.body.purchasePrice).toBe(800.00);
      expect(response.body.stock).toBe(3);
   });
});