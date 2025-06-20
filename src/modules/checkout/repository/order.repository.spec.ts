import { Sequelize } from "sequelize-typescript";

import OrderModel from "./order.model";
import Order from "../domain/order.entity";
import Product from "../domain/product.entity";
import OrderItemModel from "./order-item.model";
import OrderRepository from "./order.repository";
import Client, { ClientId } from "../domain/client.entity";

describe("OrderRepository unit test", () => {

    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: { force: true },
        });

        await sequelize.addModels([OrderModel, OrderItemModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it('should add an order', async () => {

        const client = new Client({
            id: new ClientId(null),
            name: 'Sonia',
            email: 'sonia@teste.com',
            document: '239.549.810-68',
            street: 'Paulista',
            number: '3',
            complement: 'Predio',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '01212-100',
        });

        const product = new Product({
            name: 'Note book',
            description: 'Note book',
            salesPrice: 8000.00,
            quantity: 1,
        });

        const products: Product[] = [];
        products.push(product);

        const props = {
           clientId: client.id.id,
           products,
           status: 'approved',
           invoiceId: '1',
        };

        const order = new Order(props);

        const orderRepository = new OrderRepository();
        await orderRepository.addOrder(order);

        const orderDb = await OrderModel.findOne({
               where: { id: order.id.id },
               include: ['orderItems'],
        });

        expect(orderDb).not.toBeNull();
        expect(orderDb.id).toBe(order.id.id);
        expect(orderDb.clientId).toBe(order.clientId);
        expect(orderDb.invoiceId).toBe(order.invoiceId);

        expect(orderDb.orderItems.length).toBe(1);
        expect(orderDb.orderItems.reduce((total, item) => total + item.price, 0)).toBe(order.total);

        orderDb.orderItems.forEach((item, index) => {

          let expectedItem = order.products[index];

          expect(expectedItem.id.id).not.toBeNull();
          expect(item.productId).toBe(expectedItem.id.id);
          expect(item.name).toBe(expectedItem.name);
          expect(item.price).toBe(expectedItem.salesPrice);
          expect(item.quantity).toBe(expectedItem.quantity);
        });
    });

    it('should find an order', async () => {

        const orderItem = new OrderItemModel({
              orderId: '1',
              productId: '1',
              name: 'Note book',
              price: 8000.00,
              quantity: 1,
        });

        let orderItems: OrderItemModel[] = [];
        orderItems.push(orderItem);

        const order = await OrderModel.create({
            id: '1',
            invoiceId: '1',
            status: 'approved',
            total: 8000.00,
            clientId: '1',
            orderItems,
            updatedAt: new Date(),
            createdAt: new Date(),
         },
         {
            include: [{model: OrderItemModel, as: 'orderItems'}],
        });

        const orderRepository = new OrderRepository();

        let result = await orderRepository.findOrderById(order.id);

        expect(result).not.toBeNull();
        expect(result.id.id).toBe(order.id);
        expect(result.invoiceId).toBe(order.invoiceId);
        expect(result.status).toBe(order.status);
        expect(result.total).toBe(order.total);
        expect(result.clientId).toBe(order.clientId);

        expect(result.products.length).toBe(1);
        expect(result.total).toBe(order.orderItems.reduce((total, item) => total + item.price, 0));

        result.products.forEach((item, index) => {

          let expectedItem = order.orderItems[index];

          expect(item.id.id).toBe(expectedItem.productId);
          expect(item.name).toBe(expectedItem.name);
          expect(item.salesPrice).toBe(expectedItem.price);
          expect(item.quantity).toBe(expectedItem.quantity);
        });
    });

    it('should find an orders by clientId', async () => {

        const orderItem1 = new OrderItemModel({
            orderId: '1',
            productId: '1',
            name: 'Note book',
            price: 8000.00,
            quantity: 1,
        });

        let orderItems: OrderItemModel[] = [];
        orderItems.push(orderItem1);

        const order1 = await OrderModel.create({
            id: '1',
            invoiceId: '1',
            status: 'approved',
            total: 8000.00,
            clientId: '1',
            orderItems,
            updatedAt: new Date(),
            createdAt: new Date(),
         },
         {
            include: [{model: OrderItemModel, as: 'orderItems'}],
        });

        const orderItem2 = new OrderItemModel({
            orderId: '2',
            productId: '2',
            name: 'Tablet',
            price: 2000.00,
            quantity: 1,
        });

        orderItems = [];
        orderItems.push(orderItem2);       

        const order2 = await OrderModel.create({
            id: '2',
            invoiceId: '2',
            status: 'approved',
            total: 2000.00,
            clientId: '1',
            orderItems,
            updatedAt: new Date(),
            createdAt: new Date(),
         },
         {
            include: [{model: OrderItemModel, as: 'orderItems'}],
        });

        const orderRepository = new OrderRepository();

        let result = await orderRepository.findOrdersByClientId('1');

        expect(result.length).toBe(2);
        expect(result[0].id.id).toBe(order1.id);
        expect(result[0].invoiceId).toBe(order1.invoiceId);
        expect(result[0].status).toBe(order1.status);
        expect(result[0].total).toBe(order1.total);
        expect(result[0].clientId).toBe(order1.clientId);

        expect(result[0].products.length).toBe(1);
        expect(result[0].total).toBe(order1.orderItems.reduce((total, item) => total + item.price, 0));

        result[0].products.forEach((item, index) => {

          let expectedItem = order1.orderItems[index];

          expect(item.id.id).toBe(expectedItem.productId);
          expect(item.name).toBe(expectedItem.name);
          expect(item.salesPrice).toBe(expectedItem.price);
          expect(item.quantity).toBe(expectedItem.quantity);
        });

        expect(result[1].id.id).toBe(order2.id);
        expect(result[1].invoiceId).toBe(order2.invoiceId);
        expect(result[1].status).toBe(order2.status);
        expect(result[1].total).toBe(order2.total);
        expect(result[1].clientId).toBe(order2.clientId);

        expect(result[1].products.length).toBe(1);
        expect(result[1].total).toBe(order2.orderItems.reduce((total, item) => total + item.price, 0));

        result[1].products.forEach((item, index) => {

          let expectedItem = order2.orderItems[index];

          expect(item.id.id).toBe(expectedItem.productId);
          expect(item.name).toBe(expectedItem.name);
          expect(item.salesPrice).toBe(expectedItem.price);
          expect(item.quantity).toBe(expectedItem.quantity);
        });
    });
});