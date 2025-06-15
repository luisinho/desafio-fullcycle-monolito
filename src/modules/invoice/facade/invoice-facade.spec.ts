import { Sequelize } from "sequelize-typescript";
import InvoiceModel from "../repository/invoice.model";
import InvoiceItemModel from "../repository/invoice-item.model";
import Address from "../../@shared/domain/value-object/address";
import InvoiceFacadeFactory from "../factory/invoice-facade.factory";
import { NotFoudException } from "@shared/domain/validation/not-found.exception";
import { ValidationException } from "@shared/domain/validation/validation.exception";

const itemsMock = [{   
    invoiceId: '1',
    name: 'Note Book',
    price: 3500.00,
    quantity: 1,
 },
 {
    invoiceId: '1',
    name: 'Mac Book',
    price: 10.500,
    quantity: 1,
},];

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

        const items = itemsMock.map((item) => {
            return new InvoiceItemModel({
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                invoiceId: item.invoiceId,
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
        expect(result.total).toBe(invoice.items.reduce((total, item) => total + (item.price * item.quantity), 0));

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

        const items = itemsMock.map((item) => {
            return new InvoiceItemModel({
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                invoiceId: item.invoiceId,
           });
        });

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

         await expect(invoiceFacade.find(input)).rejects.toThrow(new NotFoudException(`Invoice with id ${input.id} not found.`));
    });

    it('should generate a invoice', async () => {

        const invoiceFacade = InvoiceFacadeFactory.create();

        const items = itemsMock.map((item) => {
            return new InvoiceItemModel({
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                invoiceId: item.invoiceId,
           });
        });

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

    it('should throw an error when trying to generate an invoice with an invalid address (missing zipCode)', async () => {

        const invoiceFacade = InvoiceFacadeFactory.create();

        const items = itemsMock.map((item) => {
            return new InvoiceItemModel({
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                invoiceId: item.invoiceId,
           });
        });

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

        await expect(invoiceFacade.generate(input)).rejects.toThrow(ValidationException);
    });
});