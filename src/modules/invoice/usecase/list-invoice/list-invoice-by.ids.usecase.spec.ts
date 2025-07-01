import Invoice, { InvoiceId } from "../../domain/invoice.entity";
import Address from "@shared/domain/value-object/address";
import ListInvoiceByIdsUseCase from "./list-invoice-by.ids.usecase";
import InvoiceItem, { InvoiceItemId } from "../../domain/invoice-item.entity";
import { NotFoudException } from "@shared/domain/validation/not-found.exception";

const address = new Address('Paulista', '3', 'São Paulo', 'São Paulo', '01212-100', 'Predio');

const itemNoteBook = new InvoiceItem({
    id: new InvoiceItemId('1'),
    name: 'Note Book',
    price: 3000.00,
    quantity: 1,
});

const itemMacBook = new InvoiceItem({
    id: new InvoiceItemId('2'),
    name: 'Mac Book',
    price: 1000.00,
    quantity: 1,
});

const invoice1 = new Invoice({
    id: new InvoiceId('1'),
    name: 'Sandra',
    document: '774.023.970-41',
    address: address,
    items: [itemNoteBook, itemMacBook],
    createdAt: new Date(),
    updatedAt: new Date(),
});

const invoice2 = new Invoice({
    id: new InvoiceId('2'),
    name: 'Sandra',
    document: '774.023.970-41',
    address: address,
    items: [itemNoteBook],
    createdAt: new Date(),
    updatedAt: new Date(),
});


const MockRepository = (invoicesToReturn: Invoice[] = []) => {
    return {
        find: jest.fn().mockReturnValue(Promise.resolve(invoicesToReturn)),
        generate: jest.fn(),
        listByIds: jest.fn().mockReturnValue(Promise.resolve(invoicesToReturn)),
    };
};

describe("ListInvoiceByIdsUseCase (unit test)", () => {

    it('should list invoices by ids', async () => {

        const invoiceRepository = MockRepository([invoice1, invoice2]);

        const useCase = new ListInvoiceByIdsUseCase(invoiceRepository);

        const input = {
            ids: ['1', '2'],
        };

        const result = await useCase.execute(input);

        expect(invoiceRepository.listByIds).toHaveBeenCalledTimes(1);
        expect(result).not.toBeNull();
        expect(result.length).toBe(2);
        expect(result[0].id).toBe(invoice1.id.id);
        expect(result[0].document).toBe(invoice1.document);
        expect(result[0].address.city).toBe(invoice1.address.city);
        expect(result[0].address.complement).toBe(invoice1.address.complement);
        expect(result[0].address.number).toBe(invoice1.address.number);
        expect(result[0].address.state).toBe(invoice1.address.state);
        expect(result[0].address.street).toBe(invoice1.address.street);
        expect(result[0].address.zipCode).toBe(invoice1.address.zipCode);
        expect(result[0].total).toBe(invoice1.items.reduce((total, item) => total + (item.price * item.quantity), 0));
        expect(result[0].items.length).toBe(2);
        expect(result[0].createdAt).toBeInstanceOf(Date);

        result[0].items.forEach((item, index) => {
            const expectedItem = invoice1.items[index];
            expect(item.id).toBe(expectedItem.id.id);
            expect(item.name).toBe(expectedItem.name);
            expect(item.price).toBe(expectedItem.price);
            expect(item.quantity).toBe(expectedItem.quantity);
        });

        expect(result[1].id).toBe(invoice2.id.id);
        expect(result[1].document).toBe(invoice2.document);
        expect(result[1].address.city).toBe(invoice2.address.city);
        expect(result[1].address.complement).toBe(invoice2.address.complement);
        expect(result[1].address.number).toBe(invoice2.address.number);
        expect(result[1].address.state).toBe(invoice2.address.state);
        expect(result[1].address.street).toBe(invoice2.address.street);
        expect(result[1].address.zipCode).toBe(invoice2.address.zipCode);
        expect(result[1].total).toBe(invoice2.items.reduce((total, item) => total + (item.price * item.quantity), 0));
        expect(result[1].items.length).toBe(1);
        expect(result[1].createdAt).toBeInstanceOf(Date);

        result[1].items.forEach((item, index) => {
            const expectedItem = invoice2.items[index];
            expect(item.id).toBe(expectedItem.id.id);
            expect(item.name).toBe(expectedItem.name);
            expect(item.price).toBe(expectedItem.price);
            expect(item.quantity).toBe(expectedItem.quantity);
        });
    });

    it('should throw an error if invoices with ids not found', async () => {

        const invoiceRepository = {
            generate: jest.fn(),
            find: jest.fn().mockReturnValue(Promise.resolve([])),
            listByIds: jest.fn().mockImplementation(() => {
                throw new NotFoudException('Invoices not found!');
            }),
        };

        const input = {
            ids: ['1', '2'],
        };

        const useCase = new ListInvoiceByIdsUseCase(invoiceRepository);

        await expect(useCase.execute(input)).rejects.toThrow(NotFoudException);
    });
});