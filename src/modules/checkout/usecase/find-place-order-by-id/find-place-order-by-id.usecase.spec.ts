import { mock } from "jest-mock-extended";

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

const order = {
    id: new OrderId('1'),
    client: 'undefined',
    clientId: '1',
    products: [{  id: '1', name: 'Note Book',  price: 8000.00,  quantity: 1}],
    status: '',
    invoiceId: '1',
}

const MockRepository = () => {
    return {
        addOrder: jest.fn(),
        findOrderById: jest.fn().mockReturnValue(Promise.resolve(order)),
    };
};

describe("FindPlaceOrderById usecase unit test", () => {

    it('should find a place order by id', async () => {

        const invoiceFacadeMock = mock<InvoiceFacadeInterface>();

        invoiceFacadeMock.find.mockResolvedValue({
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
            items: [{  id: '1', name: 'Note Book',  price: 800,  quantity: 1}],
            total: 8000,
            createdAt: new Date(),
        });

        const repository = MockRepository();
        const useCase = new FindPlaceOrderByIdUsecase(repository, invoiceFacadeMock);

        const result = await useCase.execute({id: '1'});

        expect(repository.findOrderById).toHaveBeenCalledTimes(1);
        expect(result).not.toBeNull();
        expect(result.id).toBe(order.id.id);
    });
});