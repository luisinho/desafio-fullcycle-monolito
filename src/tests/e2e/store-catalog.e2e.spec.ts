import { Umzug } from "umzug";
import request from "supertest";
import { Express } from "express";
import { Sequelize } from "sequelize-typescript";

import { setupTestApp } from "../../tests/e2e/utils/test-helper";
import { migrator } from "../../infrastructure/config-migrations/migrator";
import Product from "../../modules/store-catalog/domain/product.entity";
import Id from "@shared/domain/value-object/id.value-object";
import  ProductRepository  from "../../modules/store-catalog/repository/product.repository";
import { StoreCatalogProductModel } from "../../modules/store-catalog/repository/product.model";

jest.setTimeout(30000);

let app: Express;

describe("E2E test for StoreCatalog", () => {

       let sequelize: Sequelize;
        
       let migration: Umzug<any>;

       beforeEach(async () => {
          app = setupTestApp();
          sequelize = new Sequelize({
          dialect: 'sqlite',
          storage: ":memory:",
          logging: false,
        });

        sequelize.addModels([StoreCatalogProductModel]);
        migration = migrator(sequelize);
        await migration.up();
       });

       afterEach(async () => {
         jest.restoreAllMocks();
         if (!migration || !sequelize) {
            return;
         }
         migration = migrator(sequelize);
         await migration.down();
         await sequelize.close();
       });

       it('should find all products', async () => {

        jest.spyOn(ProductRepository.prototype, 'findAll')
            .mockResolvedValue([new Product({
             id: new Id('1'),
             name: 'Notebook',
             description: 'Notebook Gamer',
             salesPrice: 5000,
        })]);

        const response = await request(app)
                .get('/store-catalog/list')
                .set('Accept', 'application/json')
                .send();

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].id).toBe('1');
        expect(response.body[0].name).toBe('Notebook');
        expect(response.body[0].description).toBe('Notebook Gamer');
        expect(response.body[0].salesPrice).toBe(5000);
    });
});