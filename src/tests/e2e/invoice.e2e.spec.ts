import { Umzug } from "umzug";
import request from "supertest";
import { Express } from "express";
import { Sequelize } from "sequelize-typescript";

import { setupTestApp } from "../../tests/e2e/utils/test-helper";
import { migrator } from "../../infrastructure/config-migrations/migrator";

import { InvoiceModel } from "../../modules/invoice/repository/invoice.model";
import { InvoiceItemModel } from "../../modules/invoice/repository/invoice-item.model";

jest.setTimeout(30000);

let app: Express;

describe("E2E test for invoice", () => {

    let sequelize: Sequelize;

    let migration: Umzug<any>;

    beforeEach(async () => {
        app = setupTestApp();
        sequelize = new Sequelize({
         dialect: 'sqlite',
         storage: ":memory:",
         logging: false,
        });

        sequelize.addModels([InvoiceModel, InvoiceItemModel]);
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

    it('should generate a invoices', async () => {

       const response = await request(app)
            .post('/invoices')
            .set('Accept', 'application/json')
            .send({
                name: 'Sonia',
                document: '953.549.440-66',
                street: 'Paulista',
                number: '3',
                complement: 'Predio',
                city: 'São Paulo',
                state: 'SP',
                zipCode: '01030-100',
                items: [{id: '1', name: 'Notebook', price: 5000, quantity: 1}]
        });

        expect(response.status).toBe(201);
        expect(response.body.id).toBeDefined();
        expect(response.body.name).toBe('Sonia');
        expect(response.body.document).toBe('953.549.440-66');
        expect(response.body.street).toBe('Paulista');
        expect(response.body.number).toBe('3');
        expect(response.body.complement).toBe('Predio');
        expect(response.body.city).toBe('São Paulo');
        expect(response.body.state).toBe('SP');
        expect(response.body.zipCode).toBe('01030-100');
        expect(response.body.items.length).toBe(1);
        expect(response.body.items[0].id).toBe('1');
        expect(response.body.items[0].name).toBe('Notebook');
        expect(response.body.items[0].price).toBe(5000);
        expect(response.body.items[0].quantity).toBe(1);
        expect(response.body.total).toBe(5000);      
    });

    it('should find a invoice', async () => {

        const response201 = await request(app)
            .post('/invoices')
            .set('Accept', 'application/json')
            .send({
                name: 'Sonia',
                document: '953.549.440-66',
                street: 'Paulista',
                number: '3',
                complement: 'Predio',
                city: 'São Paulo',
                state: 'SP',
                zipCode: '01030-100',
                items: [{id: '1', name: 'Notebook', price: 5000, quantity: 1}]
        });

        expect(response201.status).toBe(201);
        expect(response201.body.id).toBeDefined();

        const response200 = await request(app)
            .get(`/invoices/${response201.body.id}`)
            .set('Accept', 'application/json')
            .send();

        expect(response200.status).toBe(200);
        expect(response200.body.id).toBeDefined();
        expect(response200.body.name).toBe('Sonia');
        expect(response200.body.document).toBe('953.549.440-66');
        expect(response200.body.address.street).toBe('Paulista');
        expect(response200.body.address.number).toBe('3');
        expect(response200.body.address.complement).toBe('Predio');
        expect(response200.body.address.city).toBe('São Paulo');
        expect(response200.body.address.state).toBe('SP');
        expect(response200.body.address.zipCode).toBe('01030-100');
        expect(response200.body.items.length).toBe(1);
        expect(response200.body.items[0].id).toBeDefined();
        expect(response200.body.items[0].name).toBe('Notebook');
        expect(response200.body.items[0].price).toBe(5000);
        expect(response200.body.items[0].quantity).toBe(1);
        expect(response200.body.total).toBe(5000);
    });

    it('should list a invoice', async () => {

        const response1 = await request(app)
            .post('/invoices')
            .set('Accept', 'application/json')
            .send({
                name: 'Sonia',
                document: '953.549.440-66',
                street: 'Paulista',
                number: '3',
                complement: 'Predio',
                city: 'São Paulo',
                state: 'SP',
                zipCode: '01030-100',
                items: [{id: '1', name: 'Notebook', price: 5000, quantity: 1}]
        });        

        const response2 = await request(app)
            .post('/invoices')
            .set('Accept', 'application/json')
            .send({
                name: 'Sandra',
                document: '952.549.441-90',
                street: 'Paulista',
                number: '4',
                complement: 'Predio',
                city: 'São Paulo',
                state: 'SP',
                zipCode: '01030-100',
                items: [{id: '1', name: 'Notebook', price: 5000, quantity: 2}]
         });

        const response200 = await request(app)
            .get(`/invoices/list/${response1.body.id},${response2.body.id}`)
            .set('Accept', 'application/json')
            .send();

        expect(response200.status).toBe(200);
        expect(response200.body.length).toBe(2);        

        expect(response200.body[0].id).toBeDefined();
        expect(response200.body[0].name).toBe('Sonia');
        expect(response200.body[0].document).toBe('953.549.440-66');
        expect(response200.body[0].address.street).toBe('Paulista');
        expect(response200.body[0].address.number).toBe('3');
        expect(response200.body[0].address.complement).toBe('Predio');
        expect(response200.body[0].address.city).toBe('São Paulo');
        expect(response200.body[0].address.state).toBe('SP');
        expect(response200.body[0].address.zipCode).toBe('01030-100');
        expect(response200.body[0].items.length).toBe(1);
        expect(response200.body[0].items[0].id).toBeDefined();
        expect(response200.body[0].items[0].name).toBe('Notebook');
        expect(response200.body[0].items[0].price).toBe(5000);
        expect(response200.body[0].items[0].quantity).toBe(1);
        expect(response200.body[0].total).toBe(5000);

        expect(response200.body[1].id).toBeDefined();
        expect(response200.body[1].name).toBe('Sandra');
        expect(response200.body[1].document).toBe('952.549.441-90');
        expect(response200.body[1].address.street).toBe('Paulista');
        expect(response200.body[1].address.number).toBe('4');
        expect(response200.body[1].address.complement).toBe('Predio');
        expect(response200.body[1].address.city).toBe('São Paulo');
        expect(response200.body[1].address.state).toBe('SP');
        expect(response200.body[1].address.zipCode).toBe('01030-100');
        expect(response200.body[1].items.length).toBe(1);
        expect(response200.body[1].items[0].id).toBeDefined();
        expect(response200.body[1].items[0].name).toBe('Notebook');
        expect(response200.body[1].items[0].price).toBe(5000);
        expect(response200.body[1].items[0].quantity).toBe(2);
        expect(response200.body[1].total).toBe(10000);
    });

    it('should throw an error if invoices with ids not found', async () => {

        const response = await request(app).get('/invoices/list/1,2')
        .set('Accept', 'application/json')
        .send();

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Invoices not found.');
    });

    it('should throw an error when trying to find an invoice with an id not found', async () => {

        const response = await request(app).get('/invoices/1')
        .set('Accept', 'application/json')
        .send();

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Invoice with id 1 not found.');
    });
});