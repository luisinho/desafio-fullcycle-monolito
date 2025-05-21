import request from "supertest";
import { initApi }  from "../../infrastructure/api/api";
import { dbLojaSequelize } from "../../infrastructure/db/database";

let api: any;

jest.setTimeout(30000);
describe('E2E test for product', () => {

      beforeAll(async () => {
        api = await initApi();
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

    it('should return 200 when checking stock of an existing product', async () => {
     
      const createResponse = await request(api).post('/products').send({
        name: 'Notebook',
        description: 'Notebook dell',
        purchasePrice: 800.00,
        stock: 4,
      });
    
      const productId = createResponse.body.id;

      const response = await request(api).get(`/products/check-stock/${productId}`);

      expect(response.status).toBe(200);
      expect(response.body.productId).toBe(productId);
      expect(response.body.stock).toBe(4);
    });

    it('should return 404 when checking stock of a non-existent product', async () => {

      const response = await request(api).get('/products/check-stock/1');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Product with id 1 not found');
  });

  it('should return 409 when trying to add a product with an existing ID', async () => {

      const payload = {
        id: '1',
        name: 'Notebook dell',
        description: 'Notebook dell 1.0',
        purchasePrice: 800.00,
        stock: 3
      };

      const response1 = await request(api).post('/products').send(payload);
      expect(response1.status).toBe(201);    

      const response2 = await request(api).post('/products').send(payload);
      expect(response2.status).toBe(409);
      expect(response2.body.message).toBe('Product with id 1 already exists');
  });
});