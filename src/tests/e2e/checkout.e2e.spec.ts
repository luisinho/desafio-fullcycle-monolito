import { Umzug } from "umzug";
import request from "supertest";
import { Express } from "express";
import { Sequelize } from "sequelize-typescript";

import { setupTestApp } from "../../tests/e2e/utils/test-helper";
import { migrator } from "../../infrastructure/config-migrations/migrator";

import Order, { OrderId } from "../../modules/checkout/domain/order.entity";
import  Product, { ProductId } from "../../modules/checkout/domain/product.entity";

import { OrderModel } from "../../modules/checkout/repository/order.model";
import { InvoiceModel } from "../../modules/invoice/repository/invoice.model";
import { ClientModel } from "../../modules/client-adm/repository/client.model";
import OrderRepository from "../../modules/checkout/repository/order.repository";
import ClientAdmFacade from "../../modules/client-adm/facade/client-adm.facade";
import { ProductModel } from "../../modules/product-adm/repository/product.model";
import { OrderItemModel } from "../../modules/checkout/repository/order-item.model";
import ProductAdmFacade from "../../modules/product-adm/facade/product-adm.facade";
import { TransactionModel } from "../../modules/payment/repository/transaction.model";
import { InvoiceItemModel } from "../../modules/invoice/repository/invoice-item.model";
import StoreCatalogFacade from "../../modules/store-catalog/facade/store-catalog.facade";
import { StoreCatalogProductModel } from "../../modules/store-catalog/repository/product.model";

let clientModel: ClientModel;
let invoiceModel: InvoiceModel;
let orderModel: OrderModel;
let product: ProductModel;

jest.setTimeout(30000);

let app: Express;

describe("E2E test for checkout", () => {

      let sequelize: Sequelize;

      let migration: Umzug<any>;

      beforeEach(async () => {
         app = setupTestApp();
         sequelize = new Sequelize({
         dialect: 'sqlite',
         storage: ":memory:",
         logging: false,
      });

       sequelize.addModels([ClientModel, InvoiceModel, InvoiceItemModel, ProductModel, OrderModel, OrderItemModel, StoreCatalogProductModel, TransactionModel]);
       migration = migrator(sequelize);
       await migration.up();

       clientModel = await ClientModel.create({
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

       await StoreCatalogProductModel.findOne({
         where: {
           id: product.id,
         },
       });

       await TransactionModel.create({
         id: '1',
         orderId: '1',
         amount: 9500.00,
         status: 'approved',
         createdAt: new Date(),
         updatedAt: new Date(),
       });

       let invoiceItemsModel: InvoiceItemModel[] = [];

       const invoiceItemModel = new InvoiceItemModel();      
       invoiceItemModel.invoiceId = '1';
       invoiceItemModel.name = product.name;
       invoiceItemModel.price = product.salesPrice;
       invoiceItemModel.quantity = 1;
       invoiceItemsModel.push(invoiceItemModel);      

       invoiceModel = await InvoiceModel.create({
         id: '1',
         name: clientModel.name,
         document: clientModel.document,
         street: clientModel.street,
         number: clientModel.number,
         complement: clientModel.complement,
         city: clientModel.city,
         state: clientModel.state,
         zipCode: clientModel.zipCode,
         items: invoiceItemsModel,
         createdAt: new Date(),
         updatedAt: new Date(),
       },
       {
         include: [{model: InvoiceItemModel, as: 'items'}],
       }
     );

     let orderItemsModel: OrderItemModel[] = [];          
    
     let orderItemModel = new OrderItemModel();
     orderItemModel.productId = '1';
     orderItemModel.orderId = '1';
     orderItemModel.name = 'Note book';
     orderItemModel.price = 9500.00;
     orderItemModel.quantity = 1;
     orderItemsModel.push(orderItemModel);

     orderModel = await OrderModel.create({
        id: '1',
        invoiceId: invoiceModel.id,
        status: 'approved',
        total: orderItemsModel.reduce((total, item) => total + item.price, 0),
        clientId: clientModel.id,
        createdAt: new Date(),
        updatedAt: new Date(),
        orderItems: orderItemsModel,
      },
      {
        include: [{model: OrderItemModel, as: 'orderItems'}],
      });
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

    it('should add an addOrder throw an error when client by id not found', async () => {

      const response = await request(app)
        .post('/checkout')
        .send({
          clientId: '2',
          document: '',
          products: [
            {
              productId: '1',
              quantity: 1,
            }
          ]
      });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Client with id 2 not found.');
    });

    it('should add an addOrder throw an error when client by by document not found', async () => {

      const response = await request(app)
        .post('/checkout')
        .send({
          clientId: '',
          document: '265.960.230-10',
          products: [
            {
              productId: '1',
              quantity: 1,
            }
          ]
      });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Client with document 265.960.230-10 not found.');
    });

    it('should add an addOrder throw an error when clientId and document do not match', async () => {

      const response = await request(app)
        .post('/checkout')
        .send({
          clientId: '1',
          document: '265.960.230-10',
          products: [
            {
              productId: '1',
              quantity: 1,
            }
          ]
      });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Client ID and document do not match.');
    });

    it('should add an addOrder throw an error when neither clientId nor document is provided', async () => {

      const response = await request(app)
        .post('/checkout')
        .send({
          clientId: '',
          document: '',
          products: [
            {
              productId: '1',
              quantity: 1,
            }
          ]
      });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('You must provide either id or document.');
    });

    it('should add an addOrder throw an error when no products selected', async () => {

      const response = await request(app)
        .post('/checkout')
        .send({
          clientId: '',
          document: '561.972.930-30',
          products: []
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('No products selected.');
    });

    it('should add an addOrder throw when product not found', async () => {      

      jest.spyOn(StoreCatalogFacade.prototype, 'find')
          .mockResolvedValue(null);

      const response = await request(app)
        .post('/checkout')
        .send({
          clientId: '',
          document: '561.972.930-30',
          products: [
            {
              productId: '3',
              quantity: 1,
            }
          ]
      });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Product 3 not found.');
    });

    it('should add an addOrder throw when product is not available in stock', async () => {
      
      jest.spyOn(ProductAdmFacade.prototype, 'checkStock')
          .mockResolvedValue({ productId: '2', stock: 0 });

      const response = await request(app)
        .post('/checkout')
        .send({
          clientId: '',
          document: '561.972.930-30',
          products: [
            {
              productId: '1',
              quantity: 1,
            }
          ]
      });

      expect(response.status).toBe(409);
      expect(response.body.message).toBe('Product 2 is not available in stock.');
    });

    it('should add an addOrder', async () => {

      const response = await request(app)
        .post('/checkout')
        .send({
          clientId: '',
          document: '561.972.930-30',
          products: [
           {
             productId: '1',
             quantity: 1,
           }
          ]
      });

      expect(response.status).toBe(201);
      expect(response.body.id).toBeDefined();
      expect(response.body.invoiceId).toBeDefined();
      expect(response.body.clientId).toBeDefined();
      expect(response.body.status).toBe('approved');
      expect(response.body.clientId).toBe(clientModel.id);
      expect(response.body.items).toBeDefined();
      expect(response.body.items.length).toBe(1);
      expect(response.body.items[0].productId).toBe(product.id);
      expect(response.body.items[0].name).toBe(product.name);
      expect(response.body.items[0].quantity).toBe(1);
      expect(response.body.total).toBe(orderModel.total);
  });

  it('should throw error when find a place order by id not found', async () => {

       jest.spyOn(OrderRepository.prototype, 'findOrderById')
           .mockResolvedValue(null);

      const response = await request(app)
        .get('/checkout/2')
        .send();

       expect(response.status).toBe(404);
       expect(response.body.message).toBe('No order found for id 2.');
  });

  it('should find a place order by id', async () => {

       let props = {
          id: new ProductId('1'),
          name: 'Note book',
          description: '',
          salesPrice: 9500.00,
          quantity: 1,
       };

       let product = new Product(props);

       jest.spyOn(OrderRepository.prototype, 'findOrderById')
            .mockResolvedValue(new Order({
                id: new OrderId('1'),
                clientId: '1',
                products: [product],
                status: 'approved',
                invoiceId: '1',
                createdAt: new Date(),
       }));

      const response = await request(app)
        .get('/checkout/1')
        .send();

      expect(response.status).toBe(200);
      expect(response.body.id).toBeDefined();
      expect(response.body.invoiceId).toBeDefined();
      expect(response.body.clientId).toBeDefined();
      expect(response.body.status).toBe('approved');
      expect(response.body.clientId).toBe(clientModel.id);
      expect(response.body.items).toBeDefined();
      expect(response.body.items.length).toBe(1);
      expect(response.body.items[0].productId).toBe(product.id.id);
      expect(response.body.items[0].name).toBe(product.name);
      expect(response.body.items[0].quantity).toBe(1);
      expect(response.body.total).toBe(orderModel.total);
  });

  it('should throw error when find a place order by document when not found', async () => {

       jest.spyOn(ClientAdmFacade.prototype, 'findByDocument')
          .mockResolvedValue({id: '2',
              name: 'Sandra',
              email: 'client@emil.com',
              documentType: 'CPF',
              document: '265.960.230-10',
              street: 'Paulista',
              number: '3',
              complement: 'casa',
              city: 'São Paulo',
              state: 'SP',
              zipCode: '01103-100',
              createdAt: new Date(),
              updatedAt: new Date()
       });

       jest.spyOn(OrderRepository.prototype, 'findOrdersByClientId')
           .mockResolvedValue([]);

       const response = await request(app)
         .get('/checkout/document/client/265.960.230-10')
         .send();

       expect(response.status).toBe(404);
       expect(response.body.message).toBe('No orders found for document 265.960.230-10.');
    });

    it('should find a place order by document', async () => {

      jest.spyOn(ClientAdmFacade.prototype, 'findByDocument')
          .mockResolvedValue({id: '1',
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

      let props = {
          id: new ProductId('1'),
          name: 'Note book',
          description: '',
          salesPrice: 9500.00,
          quantity: 1,
        };

      let product = new Product(props);

      jest.spyOn(OrderRepository.prototype, 'findOrdersByClientId')
          .mockResolvedValue([new Order({
              id: new OrderId('1'),
              clientId: '1',
              products: [product],
              status: 'approved',
              invoiceId: '1',
              createdAt: new Date(),
        })]);

      const response = await request(app)
        .get('/checkout/document/client/561.972.930-30')
        .send();

      expect(response.status).toBe(200);
      expect(response.body[0].id).toBeDefined();
      expect(response.body[0].invoiceId).toBeDefined();
      expect(response.body[0].clientId).toBeDefined();
      expect(response.body[0].status).toBe('approved');
      expect(response.body[0].clientId).toBe(clientModel.id);
      expect(response.body[0].items).toBeDefined();
      expect(response.body[0].items.length).toBe(1);
      expect(response.body[0].items[0].productId).toBe(product.id.id);
      expect(response.body[0].items[0].name).toBe(product.name);
      expect(response.body[0].items[0].quantity).toBe(1);
      expect(response.body[0].total).toBe(orderModel.total);
    });
});