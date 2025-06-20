import { Sequelize } from "sequelize-typescript";

import InvoiceModel from "./invoice.model";
import InvoiceItemModel from "./invoice-item.model";
import InvoiceRepository from "./invoice.repository";
import InvoiceItem from "../domain/invoice-item.entity";
import Invoice, { InvoiceId } from "../domain/invoice.entity";
import Address from "../../@shared/domain/value-object/address";
import { NotFoudException } from "@shared/domain/validation/not-found.exception";
import { ValidationException } from "@shared/domain/validation/validation.exception";

const itemsMock1 = [{
  name: 'Note Book',
  price: 3500.00,
  quantity: 1,
 },
 {
  name: 'Mac Book',
  price: 10.500,
  quantity: 1,
}];

const itemsMock2 = [{
    name: 'Tablet',
    price: 2500.00,
    quantity: 1,
   },
   {
    name: 'Note Book',
    price: 9.500,
    quantity: 1,
  }];

describe("InvoiceRepository unit test", () => {

    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: { force: true },
        });

        await sequelize.addModels([InvoiceModel, InvoiceItemModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it('should find a invoice', async () => {

        const invoiceRepository = new InvoiceRepository();

        const items = itemsMock1.map((item) => {
            return new InvoiceItemModel({
                name: item.name,
                price: item.price,
                quantity: item.quantity,                
            });
        });

        const invoice = await InvoiceModel.create({
            id: '1',
            name: 'Sandra',
            document: '812.828.610-26',
            street: 'Paulista',
            number: '3',
            complement: 'Predio',
            city: 'São Paulo',
            state: 'São Paulo',
            zipCode: '01212-100',
            items,
            createdAt: new Date(),
            updatedAt: new Date(),
         },
         {
            include: [{model: InvoiceItemModel, as: 'items'}],
         });

        const result = await invoiceRepository.find(invoice.id);

        expect(result).not.toBeNull();
        expect(result.id.id).toBe(invoice.id);
        expect(result.document).toBe(invoice.document);
        expect(result.address.city).toBe(invoice.city);
        expect(result.address.complement).toBe(invoice.complement);
        expect(result.address.number).toBe(invoice.number);
        expect(result.address.state).toBe(invoice.state);
        expect(result.address.street).toBe(invoice.street);
        expect(result.address.zipCode).toBe(invoice.zipCode);

        expect(result.items.length).toBe(2);
        expect(result.total).toBe(invoice.items.reduce((total, item) => total + item.price, 0));

        result.items.forEach((item, index) => {

          let expectedItem = invoice.items[index];

          expect(item.id.id).toBe(expectedItem.id);
          expect(item.name).toBe(expectedItem.name);
          expect(item.price).toBe(expectedItem.price);
          expect(item.quantity).toBe(expectedItem.quantity);
        });
    });

    it('should listByIds an invoices', async () => {

        const invoiceRepository = new InvoiceRepository();

        const items1 = itemsMock1.map((item) => {
            return new InvoiceItemModel({
                name: item.name,
                price: item.price,
                quantity: item.quantity,                
            });
        });

        const invoice1 = await InvoiceModel.create({
            id: '1',
            name: 'Sandra',
            document: '812.828.610-26',
            street: 'Paulista',
            number: '3',
            complement: 'Predio',
            city: 'São Paulo',
            state: 'São Paulo',
            zipCode: '01212-100',
            items:items1,
            createdAt: new Date(),
            updatedAt: new Date(),
         },
         {
            include: [{model: InvoiceItemModel, as: 'items'}],
         });

         const items2 = itemsMock2.map((item) => {
            return new InvoiceItemModel({
                name: item.name,
                price: item.price,
                quantity: item.quantity,                
            });
         });

         const invoice2 = await InvoiceModel.create({
            id: '2',
            name: 'Sandra',
            document: '812.828.610-26',
            street: 'Paulista',
            number: '3',
            complement: 'Predio',
            city: 'São Paulo',
            state: 'São Paulo',
            zipCode: '01212-100',
            items: items2,
            createdAt: new Date(),
            updatedAt: new Date(),
         },
         {
            include: [{model: InvoiceItemModel, as: 'items'}],
         });

         const result = await invoiceRepository.listByIds([invoice1.id, invoice2.id]);

        expect(result.length).toBe(2);

        expect(result).not.toBeNull();
        expect(result[0].id.id).toBe(invoice1.id);
        expect(result[0].document).toBe(invoice1.document);
        expect(result[0].address.city).toBe(invoice1.city);
        expect(result[0].address.complement).toBe(invoice1.complement);
        expect(result[0].address.number).toBe(invoice1.number);
        expect(result[0].address.state).toBe(invoice1.state);
        expect(result[0].address.street).toBe(invoice1.street);
        expect(result[0].address.zipCode).toBe(invoice1.zipCode);

        expect(result[0].items.length).toBe(2);
        expect(result[0].total).toBe(invoice1.items.reduce((total, item) => total + item.price, 0));

        result[0].items.forEach((item, index) => {

          let expectedItem = invoice1.items[index];

          expect(item.id.id).toBe(expectedItem.id);
          expect(item.name).toBe(expectedItem.name);
          expect(item.price).toBe(expectedItem.price);
          expect(item.quantity).toBe(expectedItem.quantity);
        });

        expect(result[1].id.id).toBe(invoice2.id);
        expect(result[1].document).toBe(invoice2.document);
        expect(result[1].address.city).toBe(invoice2.city);
        expect(result[1].address.complement).toBe(invoice2.complement);
        expect(result[1].address.number).toBe(invoice2.number);
        expect(result[1].address.state).toBe(invoice2.state);
        expect(result[1].address.street).toBe(invoice2.street);
        expect(result[1].address.zipCode).toBe(invoice2.zipCode);

        expect(result[1].items.length).toBe(2);
        expect(result[1].total).toBe(invoice2.items.reduce((total, item) => total + item.price, 0));

        result[1].items.forEach((item, index) => {

          let expectedItem = invoice2.items[index];

          expect(item.id.id).toBe(expectedItem.id);
          expect(item.name).toBe(expectedItem.name);
          expect(item.price).toBe(expectedItem.price);
          expect(item.quantity).toBe(expectedItem.quantity);
        });
    });

    it('should throw an error when trying to find if invoice with an id not found', async () => {

        const invoice = {
            id: '1',
        };

        const invoiceRepository = new InvoiceRepository();
        await expect(invoiceRepository.find(invoice.id)).rejects.toThrow(new NotFoudException(`Invoice with id ${invoice.id} not found.`));
    });

    it('should throw an error when trying to listByIds if invoices with an ids not found', async () => {

        const invoiceRepository = new InvoiceRepository();
        await expect(invoiceRepository.listByIds(['1', '2'])).rejects.toThrow(new NotFoudException('Invoices not found.'));
    });

    it('should generate a invoice', async () => {

        const address = new Address('Paulista', '3', 'São Paulo', 'SP', '01212-100', 'Predio');

        const items = itemsMock1.map(item => new InvoiceItem({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
        }));        

        const props = {
           id: new InvoiceId(null),
           name: 'Sandra',
           document: '128.094.150-21',
           address,
           items,
           createdAt: new Date(),
           updatedAt: new Date(),
        };

        const invoice = new Invoice(props);

        const invoiceRepository = new InvoiceRepository();
        await invoiceRepository.generate(invoice);

        const invoiceDb = await InvoiceModel.findOne({
            where: { id: invoice.id.id },
            include: ['items'],
        });

        expect(invoiceDb).not.toBeNull();
        expect(invoiceDb.id).toBe(invoice.id.id);
        expect(invoiceDb.document).toBe(invoice.document);
        expect(invoiceDb.city).toBe(invoice.address.city);
        expect(invoiceDb.complement).toBe(invoice.address.complement);
        expect(invoiceDb.number).toBe(invoice.address.number);
        expect(invoiceDb.state).toBe(invoice.address.state);
        expect(invoiceDb.street).toBe(invoice.address.street);
        expect(invoiceDb.zipCode).toBe(invoice.address.zipCode);        

        expect(invoiceDb.items.length).toBe(2);
        expect(invoiceDb.items.reduce((total, item) => total + item.price, 0)).toBe(invoice.total);

        invoiceDb.items.forEach((item, index) => {

          let expectedItem = invoice.items[index];

          expect(expectedItem.id.id).not.toBeNull();
          expect(item.name).toBe(expectedItem.name);
          expect(item.price).toBe(expectedItem.price);
          expect(item.quantity).toBe(expectedItem.quantity);
        });
    });

    it('should throw an error when trying to generate an invoice when address has multiple invalid fields', () => {

        try {
            new Address('', '', '', '', '');
        } catch (e) {
            expect(e).toBeInstanceOf(ValidationException);
            const err = e as ValidationException;
            expect(err.errors.length).toBeGreaterThanOrEqual(4);
            const fields = err.errors.map(e => e.field);
            expect(fields).toContain('street');
            expect(fields).toContain('number');
            expect(fields).toContain('city');
            expect(fields).toContain('state');
            expect(fields).toContain('zipCode');
        }
    });

    it('should throw an error when trying to generate an invoice with an invalid address (missing number)', async () => {

        const itensGenerate = itemsMock1.map(item => new InvoiceItem({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
        }));

        expect(() => {

            const props = {
            id: new InvoiceId(null),
            name: 'Sandra',
            document: '128.094.150-21',
            address: new Address('Paulista', '', 'São Paulo', 'São Paulo', '01212-100', 'Predio'),
            items: itensGenerate,
            createdAt: new Date(),
            updatedAt: new Date(),
            };

            new Invoice(props);

        }).toThrow(ValidationException);        
    });
});