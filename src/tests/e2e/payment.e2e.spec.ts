import { Umzug } from "umzug";
import request from "supertest";
import { Express } from "express";
import { Sequelize } from "sequelize-typescript";

import { setupTestApp } from "../../tests/e2e/utils/test-helper";
import { migrator } from "../../infrastructure/config-migrations/migrator";
import { TransactionModel } from "../../modules/payment/repository/transaction.model";

jest.setTimeout(30000);

let app: Express;

describe("E2E test for Payment", () => {

    let sequelize: Sequelize;

    let migration: Umzug<any>;

    beforeEach(async () => {
        app = setupTestApp();
        sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: ":memory:",
        logging: false,
    });

    sequelize.addModels([TransactionModel]);
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

    it('should find a payment by order id approved', async () => {

        const transaction = await TransactionModel.create({
            id: '1',
            orderId: 'order-3',
            amount: 100,
            status: 'approved',
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const response = await request(app)
            .get('/payment/order-3')
            .set('Accept', 'application/json')
            .send();

        expect(response.status).toBe(200);
        expect(response.body.transactionId).toBeDefined();
        expect(response.body.transactionId).toBe(transaction.id);
        expect(response.body.orderId).toBe(transaction.orderId);
        expect(response.body.amount).toBe(transaction.amount);
        expect(response.body.status).toBe(transaction.status);
        expect(response.body.createdAt).toBeDefined();
        expect(response.body.updatedAt).toBeDefined();
    });

    it('should throw an error when payment by orderId not found', async () => {

        const response = await request(app)
            .get('/payment/order-8')
            .set('Accept', 'application/json')
            .send();

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Payment with order id order-8 not found.');
    });
});