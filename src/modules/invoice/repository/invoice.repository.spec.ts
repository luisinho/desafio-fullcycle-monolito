import { Sequelize } from "sequelize-typescript";

import { InvoiceModel } from "./invoice.model";
import InvoiceItemModel from "./invoice-item.model";
import InvoiceRepository from "./invoice.repository";
import Invoice, { InvoiceId } from "../domain/invoice.entity";
import Address from "../../@shared/domain/value-object/address";
import InvoiceItem, { InvoiceItemId } from "../domain/invoice-item.entity";

const itemsMock = [{
    id: '1',
    name: 'Note Book',
    price: 3.500,
},
{
    id: '2',
    name: 'Mac Book',
    price: 10.500,
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

        const itensFind  = itemsMock;

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
            items: itensFind,
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
          const expectedItem = invoice.items[index];
          expect(item.id.id).toBe(expectedItem.id);
          expect(item.name).toBe(expectedItem.name);
          expect(item.price).toBe(expectedItem.price);
        });
    });

    it('should throw an error when trying to find an invoice with an id not found', async () => {

        const invoice = {
            id: '1',
        };

        const invoiceRepository = new InvoiceRepository();
        await expect(invoiceRepository.find(invoice.id)).rejects.toThrow(`Invoice with id ${invoice.id} not found!`);
    });

    it('should generate a invoice', async () => {

        const itensGenerate = itemsMock.map(item => new InvoiceItem({
            id: new InvoiceItemId(item.id),
            name: item.name,
            price: item.price,
        }));        

        const props = {
           id: new InvoiceId(null),
           name: 'Sandra',
           document: '128.094.150-21',
           address: new Address('Paulista', '3', 'São Paulo', 'São Paulo', '01212-100', 'Predio'),
           items: itensGenerate,
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
          const expectedItem = invoice.items[index];
          expect(item.id).toBe(expectedItem.id.id);
          expect(item.name).toBe(expectedItem.name);
          expect(item.price).toBe(expectedItem.price);
        });
    });

    it('should throw an error when trying to generate an invoice with an invalid address (missing number)', async () => {

        const itensGenerate = itemsMock.map(item => new InvoiceItem({
            id: new InvoiceItemId(item.id),
            name: item.name,
            price: item.price,
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

        }).toThrow('All required address fields must be provided!');
    });
});