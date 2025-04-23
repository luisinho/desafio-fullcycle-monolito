import { Sequelize } from "sequelize-typescript";
import { InvoiceModel } from "../repository/invoice.model";
import InvoiceItemModel from "../repository/invoice-item.model";
import InvoiceFacadeFactory from "../factory/invoice-facade.factory";

const items = [{
    id: '1',
    name: 'Note Book',
    price: 3.500,
},
{
    id: '2',
    name: 'Mac Book',
    price: 10.500,
}];

describe("InvoiceFacade unit test", () => {

    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: { force: true },
        });

        await sequelize.addModels([InvoiceModel,InvoiceItemModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it('should find a invoice', async () => {

        const invoiceFacade = InvoiceFacadeFactory.create();

        const input = {
            id: '1',
        };

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

        const result = await invoiceFacade.find(input);

        expect(result).not.toBeNull();
        expect(result.id).toBe(invoice.id);
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
          expect(item.id).toBe(expectedItem.id);
          expect(item.name).toBe(expectedItem.name);
          expect(item.price).toBe(expectedItem.price);
        });
    });

    it('should throw an error when trying to find an invoice with an id not found', async () => {

        const invoiceFacade = InvoiceFacadeFactory.create();

        const input = {
            id: '3',
        };

        await InvoiceModel.create({
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

        await expect(invoiceFacade.find(input)).rejects.toThrow(`Invoice with id ${input.id} not found!`);
    });

    it('should generate a invoice', async () => {

        const invoiceFacade = InvoiceFacadeFactory.create();

        const input = {
            name: 'Sandra',
            document: '308.738.030-00',
            street: 'Paulista',
            number: '3',
            complement: 'Predio',
            city: 'São Paulo',
            state: 'São Paulo',
            zipCode: '01212-100',
            items,
        };

        const result = await invoiceFacade.generate(input);

        expect(result).not.toBeNull();
        expect(result.id).toBeDefined();
        expect(result.id).not.toBeNull();
        expect(result.document).toBe(input.document);
        expect(result.city).toBe(input.city);
        expect(result.complement).toBe(input.complement);
        expect(result.number).toBe(input.number);
        expect(result.state).toBe(input.state);
        expect(result.street).toBe(input.street);
        expect(result.zipCode).toBe(input.zipCode);

        expect(result.items.length).toBe(2);
        expect(result.total).toBe(input.items.reduce((total, item) => total + item.price, 0));

        result.items.forEach((item, index) => {
          const expectedItem = input.items[index];
          expect(item.id).toBe(expectedItem.id);
          expect(item.name).toBe(expectedItem.name);
          expect(item.price).toBe(expectedItem.price);
        });
    });

    it('should throw an error when trying to generate an invoice with an invalid address (missing zipCode)', async () => {

        const invoiceFacade = InvoiceFacadeFactory.create();

        const input = {
            name: 'Sandra',
            document: '308.738.030-00',
            street: 'Paulista',
            number: '3',
            complement: 'Predio',
            city: 'São Paulo',
            state: 'São Paulo',
            zipCode: '',
            items,
        };

        await expect(invoiceFacade.generate(input)).rejects.toThrow('All required address fields must be provided!');
    });
});