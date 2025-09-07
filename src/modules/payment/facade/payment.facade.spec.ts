import { Sequelize } from "sequelize-typescript";

import { TransactionModel } from "../repository/transaction.model";
import PaymentFacadeFactory from "../factory/payment.facade.factory";
import { NotFoudException } from "@shared/domain/validation/not-found.exception";

describe("PaymentFacade (unit test)", () => {

    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: { force: true },
        });

        await sequelize.addModels([TransactionModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it('should create a transaction approved', async () => {

        const facade = PaymentFacadeFactory.create();

        const input = {
            orderId: 'order-1',
            amount: 100,
        };

        const output = await facade.process(input);

        expect(output.transactionId).toBeDefined();
        expect(output.orderId).toBe(input.orderId);
        expect(output.amount).toBe(input.amount);
        expect(output.status).toBe('approved');
    });

    it('should create a transaction declined', async () => {

        const facade = PaymentFacadeFactory.create();

        const input = {
            orderId: 'order-2',
            amount: 80,
        };

        const output = await facade.process(input);

        expect(output.transactionId).toBeDefined();
        expect(output.orderId).toBe(input.orderId);
        expect(output.amount).toBe(input.amount);
        expect(output.status).toBe('declined');
    });

    it('should find a transaction approved by order id', async () => {        

        const facade = PaymentFacadeFactory.create();

        const transaction = await TransactionModel.create({
            id: '2',
            orderId: 'order-3',
            amount: 100,
            status: 'approved',
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const result = await facade.findByOrderId({ orderId: 'order-3'});

        expect(result.transactionId).toBeDefined();
        expect(result.transactionId).toBe(transaction.id);
        expect(result.status).toBe(transaction.status);
        expect(result.amount).toBe(transaction.amount);
        expect(result.orderId).toBe(transaction.orderId);
        expect(result.createdAt).toBeDefined();
        expect(result.updatedAt).toBeDefined();
    });

    it('should find a transaction declined by order id', async () => {

        const facade = PaymentFacadeFactory.create();

        const transaction = await TransactionModel.create({
            id: '3',
            orderId: 'order-4',
            amount: 80,
            status: 'declined',
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const input = { orderId: 'order-4'};

        const result = await facade.findByOrderId(input);

        expect(result.transactionId).toBeDefined();
        expect(result.transactionId).toBe(transaction.id);
        expect(result.status).toBe('declined');
        expect(result.amount).toBe(transaction.amount);
        expect(result.orderId).toBe(transaction.orderId);
        expect(result.createdAt).toBeDefined();
        expect(result.updatedAt).toBeDefined();
    });

    it('should throw an error when payment by orderId not found', async () => {

        const facade = PaymentFacadeFactory.create();

        await TransactionModel.create({
            id: '5',
            orderId: 'order-5',
            amount: 100,
            status: 'approved',
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const input = { orderId: 'order-8'};

        await expect(facade.findByOrderId(input)).rejects.toThrow(new NotFoudException(`Payment with order id ${input.orderId} not found.`));
    });
});