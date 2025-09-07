import { Umzug } from "umzug";
import request from "supertest";
import { Express } from "express";
import { Sequelize } from "sequelize-typescript";

import { setupTestApp } from "../../tests/e2e/utils/test-helper";
import { migrator } from "../../infrastructure/config-migrations/migrator";
import { ProductModel } from '../../modules/product-adm/repository/product.model';

jest.setTimeout(30000);

let app: Express;

describe("E2E test for product", () => {

    let sequelize: Sequelize

    let migration: Umzug<any>;

    beforeEach(async () => {
       app = setupTestApp();
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
          stock: 3,
      });

      expect(response.status).toBe(201);
      expect(response.body.id).toBeDefined();
      expect(response.body.name).toBe('Notebook dell');
      expect(response.body.description).toBe('Notebook dell 1.0');
      expect(response.body.purchasePrice).toBe(800.00);
      expect(response.body.stock).toBe(3);
   });

   it('should get stock of a product', async () => {

      const response201 = await request(app)
        .post('/products')
        .send({
          name: 'Notebook dell',
          description: 'Notebook dell 1.0',
          purchasePrice: 800.00,
          stock: 3,
      });

      expect(response201.status).toBe(201);

      const productId = response201.body.id;

      const response200 = await request(app).get(`/products/check-stock/${productId}`);
      
      expect(response200.status).toBe(200);
      expect(response200.body.productId).toBeDefined();
      expect(response200.body.stock).toBe(3);
   });

   it('should throw error when product not found', async () => {

      const response201 = await request(app)
        .post('/products')
        .send({
          name: 'Notebook dell',
          description: 'Notebook dell 1.0',
          purchasePrice: 800.00,
          stock: 3,
      });

      expect(response201.status).toBe(201);      

      const response200 = await request(app).get('/products/check-stock/1');

      expect(response200.status).toBe(404);
      expect(response200.body.message).toBe('Product with id 1 not found');
   });
});