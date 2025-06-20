import { mock } from "jest-mock-extended";

import Produt, { ProductId } from "../../domain/product.entity";
import { OrderId } from "../../domain/order.entity";
import InvoiceFacadeInterface from "../../../invoice/facade/invoice-facade.interface";
import FindPlaceOrderByIdUsecase from "./find-place-order-by-id.usecase";

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

describe("FindPlaceOrderById usecase unit test", () => {

    it('should find a place order by id', async () => {

        const invoiceFacadeMock = mock<InvoiceFacadeInterface>();

        invoiceFacadeMock.find.mockResolvedValue(invoice);

        const repository = MockRepository();
        const useCase = new FindPlaceOrderByIdUsecase(repository, invoiceFacadeMock);

        const result = await useCase.execute({id: '1'});        

        expect(repository.findOrderById).toHaveBeenCalledTimes(1);
        expect(result).not.toBeNull();
        expect(result.id).toBe(order.id.id);
        expect(result.document).toBe(invoice.document);
        expect(result.name).toBe(invoice.name);
        expect(result.invoiceId).toBe(invoice.id);
        expect(result.clientId).toBe(order.clientId);
        expect(result.status).toBe(order.status);
        expect(result.createdAt).toEqual(order.createdAt);
        expect(result.total).toBe(order.products.reduce((total, product) => total + (product.salesPrice * product.quantity), 0));

        expect(result.items.length).toBe(1);

        result.items.forEach((item, index) => {

          let expectedItem = order.products[index];

          expect(item.productId).toBe(expectedItem.id.id);
          expect(item.name).toBe(expectedItem.name);
          expect(item.salesPrice).toBe(expectedItem.salesPrice);
          expect(item.quantity).toBe(expectedItem.quantity);
        });
    });
});