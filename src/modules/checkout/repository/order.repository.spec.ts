import { Sequelize } from "sequelize-typescript";

import Order from "../domain/order.entity";
import Product from "../domain/product.entity";
import Client, { ClientId } from "../domain/client.entity";
import OrderModel from "./order.model";
import OrderItemModel from "./order-item.model";
import OrderRepository from "./order.repository";

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
           client: client,
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
        expect(orderDb.clientId).toBe(order.client.id.id);
        expect(orderDb.invoiceId).toBe(order.invoiceId);

        expect(orderDb.orderItems.length).toBe(1);
        expect(orderDb.orderItems.reduce((total, item) => total + item.price, 0)).toBe(order.total);

        orderDb.orderItems.forEach((item, index) => {
          const expectedItem = order.products[index];
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
         },
         {
            include: [{model: OrderItemModel, as: 'orderItems'}],
        });

        const orderRepository = new OrderRepository();

        const result = await orderRepository.findOrderById(order.id);

        expect(result).not.toBeNull();
        expect(result.id.id).toBe(order.id);
        expect(result.invoiceId).toBe(order.invoiceId);
        expect(result.status).toBe(order.status);
        expect(result.total).toBe(order.total);
        expect(result.clientId).toBe(order.clientId);

        expect(result.products.length).toBe(1);
        expect(result.total).toBe(order.orderItems.reduce((total, item) => total + item.price, 0));

        result.products.forEach((item, index) => {

          const expectedItem = order.orderItems[index];

          expect(item.id.id).toBe(expectedItem.productId);
          expect(item.name).toBe(expectedItem.name);
          expect(item.salesPrice).toBe(expectedItem.price);
          expect(item.quantity).toBe(expectedItem.quantity);
        });
    });
});