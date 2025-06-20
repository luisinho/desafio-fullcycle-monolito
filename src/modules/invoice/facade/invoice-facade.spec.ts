import { Sequelize } from "sequelize-typescript";
import InvoiceModel from "../repository/invoice.model";
import InvoiceItemModel from "../repository/invoice-item.model";
import Address from "../../@shared/domain/value-object/address";
import InvoiceFacadeFactory from "../factory/invoice-facade.factory";
import { NotFoudException } from "@shared/domain/validation/not-found.exception";
import { ValidationException } from "@shared/domain/validation/validation.exception";

const itemsMockNoteMac = [{
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

const itemsMocLivroSmartTv = [{
    invoiceId: '2',
    name: 'Livro',
    price: 35.00,
    quantity: 1,
 },
 {
    invoiceId: '2',
    name: 'Smart TV',
    price: 4.500,
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

        const items = itemsMockNoteMac.map((item) => {
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

          let expectedItem = invoice.items[index];

          expect(item.id).not.toBeNull();
          expect(item.name).toBe(expectedItem.name);
          expect(item.price).toBe(expectedItem.price);
        });
    });

    it('should list by ids an invoices', async () => {

        const invoiceFacade = InvoiceFacadeFactory.create();

        const itemsNoteMac = itemsMockNoteMac.map((item) => {
            return new InvoiceItemModel({
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                invoiceId: item.invoiceId,
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
            items: itemsNoteMac,
            createdAt: new Date(),
            updatedAt: new Date(),
         },
         {
            include: [{model: InvoiceItemModel, as: 'items'}],
         });

         const itemsLivroSmartTv = itemsMocLivroSmartTv.map((item) => {
            return new InvoiceItemModel({
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                invoiceId: item.invoiceId,
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
            items: itemsLivroSmartTv,
            createdAt: new Date(),
            updatedAt: new Date(),
         },
         {
            include: [{model: InvoiceItemModel, as: 'items'}],
         });

         const input = {
            ids: [invoice1.id, invoice2.id],
         };

        const result = await invoiceFacade.listByIds(input);

        expect(result.length).toBe(2);
        expect(result).not.toBeNull();

        expect(result[0].id).toBe(invoice1.id);
        expect(result[0].document).toBe(invoice1.document);
        expect(result[0].address.city).toBe(invoice1.city);
        expect(result[0].address.complement).toBe(invoice1.complement);
        expect(result[0].address.number).toBe(invoice1.number);
        expect(result[0].address.state).toBe(invoice1.state);
        expect(result[0].address.street).toBe(invoice1.street);
        expect(result[0].address.zipCode).toBe(invoice1.zipCode);

        expect(result[0].items.length).toBe(2);
        expect(result[0].total).toBe(invoice1.items.reduce((total, item) => total + (item.price * item.quantity), 0));

        result[0].items.forEach((item, index) => {

          let expectedItem = invoice1.items[index];

          expect(item.id).not.toBeNull();
          expect(item.name).toBe(expectedItem.name);
          expect(item.price).toBe(expectedItem.price);
        });

        expect(result[1].id).toBe(invoice2.id);
        expect(result[1].document).toBe(invoice2.document);
        expect(result[1].address.city).toBe(invoice2.city);
        expect(result[1].address.complement).toBe(invoice2.complement);
        expect(result[1].address.number).toBe(invoice2.number);
        expect(result[1].address.state).toBe(invoice2.state);
        expect(result[1].address.street).toBe(invoice2.street);
        expect(result[1].address.zipCode).toBe(invoice2.zipCode);

        expect(result[1].items.length).toBe(2);
        expect(result[1].total).toBe(invoice2.items.reduce((total, item) => total + (item.price * item.quantity), 0));

        result[1].items.forEach((item, index) => {

          let expectedItem = invoice2.items[index];

          expect(item.id).not.toBeNull();
          expect(item.name).toBe(expectedItem.name);
          expect(item.price).toBe(expectedItem.price);
        });
    });

    it('should throw an error when trying to find if invoice with an id not found', async () => {

        const invoiceFacade = InvoiceFacadeFactory.create();

        const input = {
            id: '3',
        };

        const items = itemsMockNoteMac.map((item) => {
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

    it('should throw an error when trying to list by ids if invoices with an id not found', async () => {

        const invoiceFacade = InvoiceFacadeFactory.create();

        const input = {
            ids: ['3', '4'],
        };

        const items = itemsMockNoteMac.map((item) => {
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

         await expect(invoiceFacade.listByIds(input)).rejects.toThrow(new NotFoudException('Invoices not found.'));
    });

    it('should generate a invoice', async () => {

        const invoiceFacade = InvoiceFacadeFactory.create();

        const items = itemsMockNoteMac.map((item) => {
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

        const items = itemsMockNoteMac.map((item) => {
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