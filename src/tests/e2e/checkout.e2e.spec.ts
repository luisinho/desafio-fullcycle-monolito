import { Umzug } from "umzug";
import request from "supertest";
import express, { Express } from "express";
import { Sequelize } from "sequelize-typescript";

import checkoutRoutes from "./../../routes/checkout.routes";
import { migrator } from "../../infrastructure/config-migrations/migrator";
import { ClientModel } from "../../modules/client-adm/repository/client.model";
import { ProductModel } from "../../modules/product-adm/repository/product.model";

let api: any;
let client: ClientModel;
let product: ProductModel;

jest.setTimeout(30000);

describe("E2E test for checkout", () => {

  const app: Express = express();
      app.use(express.json());
      app.use("/checkout", checkoutRoutes);
  
      let sequelize: Sequelize
  
      let migration: Umzug<any>;
  
      beforeEach(async () => {
          sequelize = new Sequelize({
          dialect: 'sqlite',
          storage: ":memory:",
          logging: false
      });

      sequelize.addModels([ClientModel, ProductModel])
      migration = migrator(sequelize)
      await migration.up()

      client = await ClientModel.create({
        id: '1',
        name: 'Sandra',
        email: 'client@emil.com',
        documentType: 'CPF',
        document: '561.972.930-30',
        street: 'Paulista',
        number: '3',
        complement: 'casa',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01103-100',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      product = await ProductModel.create({
        id: '1',
        name: 'Note book',
        description: 'Note Book',
        purchasePrice: 8000.00,
        salesPrice: 9500.00,
        stock: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });

    afterEach(async () => {
        if (!migration || !sequelize) {
            return 
        }
        migration = migrator(sequelize)
        await migration.down()
        await sequelize.close()
    });

    it('should add an addOrder', async () => {

        const response = await request(api)
          .post('/checkout')
          .send({
            clientId: '',
            document: '561.972.930-30',
            products: [
             {
               productId: '1',
               quantity: 1
             }
            ]
        });

        expect(response.status).toBe(201);
        expect(response.body.id).toBeDefined();
        expect(response.body.invoiceId).toBeDefined();
        expect(response.body.clientId).toBeDefined();
        expect(response.body.status).toBe('approved');
        expect(response.body.clientId).toBe(client.id);
        /*expect(response.body.items.length).toBe(1);
        expect(response.body.items[0].productId).toBe(product.id);
        expect(response.body.items[0].name).toBe(product.name);
        expect(response.body.items[0].quantity).toBe(1);
        expect(response.body.total).toBe(product.salesPrice);
        expect(response.body.createdAt).toBeDefined();*/      
    });
});