import FindInvoiceUseCase from "./find-invoice.usecase";
import Invoice, { InvoiceId } from "../../domain/invoice.entity";
import Address from "../../../@shared/domain/value-object/address";
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

const invoice = new Invoice({
    id: new InvoiceId('1'),
    name: 'Sandra',
    document: '774.023.970-41',
    address: address,
    items: [itemNoteBook, itemMacBook],
    createdAt: new Date(),
    updatedAt: new Date(),
});

const MockRepository = (invoiceToReturn: Invoice | null = null) => {
    return {
        find: jest.fn().mockReturnValue(Promise.resolve(invoiceToReturn)),
        generate: jest.fn(),
        listByIds: jest.fn().mockReturnValue(Promise.resolve([invoiceToReturn])),
    };
}

describe("FindInvoice usecase unit test", () => {

    it('should find a invoice', async () => {

        const invoiceRepository = MockRepository(invoice);
        const useCase = new FindInvoiceUseCase(invoiceRepository);

        const input = {
            id: '1',
        };

        const result = await useCase.execute(input);

        expect(invoiceRepository.find).toHaveBeenCalledTimes(1);
        expect(result).not.toBeNull();
        expect(result.id).toBe(invoice.id.id);
        expect(result.document).toBe(invoice.document);
        expect(result.document).toBe(invoice.document);
        expect(result.address.city).toBe(invoice.address.city);
        expect(result.address.complement).toBe(invoice.address.complement);
        expect(result.address.number).toBe(invoice.address.number);
        expect(result.address.state).toBe(invoice.address.state);
        expect(result.address.street).toBe(invoice.address.street);
        expect(result.address.zipCode).toBe(invoice.address.zipCode);
        expect(result.total).toBe(invoice.items.reduce((total, item) => total + item.price, 0));

        expect(result.items.length).toBe(2);

        result.items.forEach((item, index) => {
          const expectedItem = invoice.items[index];
          expect(item.id).toBe(expectedItem.id.id);
          expect(item.name).toBe(expectedItem.name);
          expect(item.price).toBe(expectedItem.price);
          expect(item.quantity).toBe(expectedItem.quantity);
        });
    });

    it('should throw an error when trying to find an invoice with an id not found', async () => {

        const invoiceRepository = {
            generate: jest.fn(),
            find: jest.fn().mockImplementation(() => {
                throw new NotFoudException('Invoice with id 3 not found.');
            }),
            listByIds: jest.fn().mockReturnValue(Promise.resolve([])),
        };

        const useCase = new FindInvoiceUseCase(invoiceRepository);

        const input = {
            id: '3',
        };

        await expect(useCase.execute(input)).rejects.toThrow(new NotFoudException('Invoice with id 3 not found.'));
    });
});