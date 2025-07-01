import { mock } from "jest-mock-extended";

import { OrderId } from "../../domain/order.entity";
import Produt, { ProductId } from "../../domain/product.entity";
import { NotFoudException } from "@shared/domain/validation/not-found.exception";
import FindPlaceOrderByDocumentUsecase from "./find-place-order-by.document.usecase";
import InvoiceFacadeInterface from "../../../invoice/facade/invoice-facade.interface";
import ClientAdmFacadeInterface from "../../../client-adm/facade/client-adm.facade.interface";

const client = {
    id: '1',
    name: 'Sandra',
    email: 'sandra@test.com',
    documentType: 'CPF',
    document: '774.023.970-41',
    street: 'Paulista',
    number: '3',
    complement: 'Predio',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01212-100',
    createdAt: new Date(),
    updatedAt: new Date(),
};

const invoice = {
    id: '1',
    name: 'Sandra',
    document: '774.023.970-41',
    address: {
      street: 'Paulista',
      number: '3',
      complement: 'Predio',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01212-100',
    },
    items: [{  id: '1', name: 'Note Book',  price: 8000.00,  quantity: 1}],
    total: 8000.00,
    createdAt: new Date(),
};

const product = new Produt({
    id: new ProductId('1'), 
    name: 'Note Book',
    description: 'Note Book',
    salesPrice: 8000.00,  
    quantity: 1
});

const order = {
    id: new OrderId('1'),
    clientId: '1',
    products: [product],
    status: 'approved',
    invoiceId: invoice.id,
    total: 8000.00,
    createdAt: new Date(),
};

const MockRepository = () => {
    return {
        addOrder: jest.fn(),
        findOrderById: jest.fn().mockReturnValue(Promise.resolve(order)),
        findOrdersByClientId: jest.fn().mockReturnValue(Promise.resolve([order])),
    };
};

describe("FindPlaceOrderByDocumentUsecase (unit test)", () => {

    it('should throw error when find a place order by document when not found', async () => {

        const repository = {
            addOrder: jest.fn(),
            findOrderById: jest.fn().mockReturnValue(Promise.resolve([])),
            findOrdersByClientId: jest.fn().mockImplementation(() => {
                throw new NotFoudException(`No orders found for document ${client.document}.`);
            }),
        };

        const clientAdmFacadeMock = mock<ClientAdmFacadeInterface>();
        clientAdmFacadeMock.findByDocument.mockResolvedValue(client);

        const invoiceFacadeMock = mock<InvoiceFacadeInterface>();

        const useCase = new FindPlaceOrderByDocumentUsecase(repository, invoiceFacadeMock, clientAdmFacadeMock);

        const input = {
            document: client.document,
        };

        await expect(useCase.execute(input)).rejects.toThrow(`No orders found for document ${client.document}.`);
    });

    it('should find a place order by document', async () => {

        const clientAdmFacadeMock = mock<ClientAdmFacadeInterface>();
        clientAdmFacadeMock.findByDocument.mockResolvedValue(client);

        const invoiceFacadeMock = mock<InvoiceFacadeInterface>();

        invoiceFacadeMock.listByIds.mockResolvedValue([invoice]);

        const repository = MockRepository();
        const useCase = new FindPlaceOrderByDocumentUsecase(repository, invoiceFacadeMock, clientAdmFacadeMock);

        const input = {
            document: '774.023.970-41',
        };

        const result = await useCase.execute(input);

        expect(result).toHaveLength(1);
        expect(result[0].id).toBe(order.id.id);
        expect(result[0].document).toBe(invoice.document);
        expect(result[0].name).toBe(invoice.name);
        expect(result[0].invoiceId).toBe(order.invoiceId);
        expect(result[0].clientId).toBe(order.clientId);
        expect(result[0].status).toBe(order.status);
        expect(result[0].items).toHaveLength(1);
        expect(result[0].items[0].productId).toBe(product.id.id);
        expect(result[0].items[0].name).toBe(product.name);
        expect(result[0].items[0].salesPrice).toBe(product.salesPrice);
        expect(result[0].items[0].quantity).toBe(product.quantity);
        expect(result[0].total).toBe(order.total);
    });
});