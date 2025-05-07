import request from "supertest";
import api  from "../../infrastructure/api/api";
import { dbLojaSequelize } from "../../infrastructure/db/database";

describe('E2E test for product', () => {

    beforeEach(async () => {
        await dbLojaSequelize.sync({ force: true });
      });

      afterAll(async () => {
        await dbLojaSequelize.close();
      });

      it('should add a products', async () => {

        const response = await request(api)
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

    it('should throw an error when product name is empty', async () => {
    
        const response = await request(api)
          .post('/products')
          .send({
            name: '',
            description: 'Notebook dell 1.0',
            purchasePrice: 800.00,
            stock: 3
        });

        expect(response.status).toBe(422);

        const nameError = response.body.errors.find((err: any) => err.field === 'name');
        expect(nameError).toBeDefined();
        expect(nameError.message).toBe('Name is required.');
    });

    it('should throw an error when product name is less than 3 characters', async () => {
    
        const response = await request(api)
          .post('/products')
          .send({
            name: 'Ab',
            description: 'Notebook dell 1.0',
            purchasePrice: 800.00,
            stock: 3
        });

        expect(response.status).toBe(422);

        const nameError = response.body.errors.find((err: any) => err.field === 'name');
        expect(nameError).toBeDefined();
        expect(nameError.message).toBe('Name must be at least 3 characters long.');
    });

    it('should throw an error when product description is empty', async () => {

        const response = await request(api)
          .post('/products')
          .send({
            name: 'Notebook',
            description: '',
            purchasePrice: 800.00,
            stock: 3
        });

        expect(response.status).toBe(422);

        const nameError = response.body.errors.find((err: any) => err.field === 'description');
        expect(nameError).toBeDefined();
        expect(nameError.message).toBe('Description is required.');
   });

   it('should throw an error when product description is less than 5 characters', async () => {

        const response = await request(api)
          .post('/products')
          .send({
            name: 'Notebook',
            description: 'Note',
            purchasePrice: 800.00,
            stock: 3
        });

        expect(response.status).toBe(422);

        const nameError = response.body.errors.find((err: any) => err.field === 'description');
        expect(nameError).toBeDefined();
        expect(nameError.message).toBe('Description must be at least 5 characters long.');
    });

    it('should throw an error when purchase price is less than or equal to 0', async () => {

        const response = await request(api)
          .post('/products')
          .send({
            name: 'Notebook',
            description: 'Notebook dell 1.0',
            purchasePrice: 0,
            stock: 3
        });

        expect(response.status).toBe(422);

        const nameError = response.body.errors.find((err: any) => err.field === 'purchasePrice');
        expect(nameError).toBeDefined();
        expect(nameError.message).toBe('Purchase price must be greater than 0.');
    });

    it('should throw an error when stock is negative', async () => {

        const response = await request(api)
          .post('/products')
          .send({
            name: 'Notebook',
            description: 'Notebook dell 1.0',
            purchasePrice: 800.00,
            stock: -1,
        });

        expect(response.status).toBe(422);

        const nameError = response.body.errors.find((err: any) => err.field === 'stock');
        expect(nameError).toBeDefined();
        expect(nameError.message).toBe('Stock cannot be negative.');
    });
});