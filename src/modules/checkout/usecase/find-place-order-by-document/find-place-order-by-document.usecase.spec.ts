import { mock } from "jest-mock-extended";

import { OrderId } from "../../domain/order.entity";
import Produt, { ProductId } from "../../domain/product.entity";
import FindPlaceOrderByDocumentUsecase from "./find-place-order-by.document.usecase";
import InvoiceFacadeInterface from "../../../invoice/facade/invoice-facade.interface";

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