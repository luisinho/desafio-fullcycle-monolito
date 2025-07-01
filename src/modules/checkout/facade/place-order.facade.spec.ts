import { mock } from "jest-mock-extended";

import Order, { OrderId } from "../domain/order.entity";
import Product, { ProductId } from "../domain/product.entity";
import CheckoutGateway from "../../checkout/gateway/checkout.gateway";
import PaymentFacadeInterface from "../../payment/facade/facade.interface";
import { PlaceOrderInputDto } from "../facade/place-order.facade.interface";
import PlaceOrderFacadeFactory from "../factory/place-order.facade.factory";
import InvoiceFacadeInterface from "../../invoice/facade/invoice-facade.interface";
import ClientAdmFacadeInterface from "../../client-adm/facade/client-adm.facade.interface";
import ProductAdmFacadeInterface from "../../product-adm/facade/product-adm.facade.interface";
import StoreCatalogFacadeInterface from "../../store-catalog/facade/store-catalog.facade.interface";

import { ConflictException } from "@shared/domain/validation/conflict.exception";
import { NotFoudException } from "@shared/domain/validation/not-found.exception";
import { BadRequestException  } from "@shared/domain/validation/bad-request.exception";

describe("PlaceOrderFacade (unit test)", () => {

    it('should throw an error add order when clientId and document do not match', async () => {

        const clientAdmFacadeMock = mock<ClientAdmFacadeInterface>();

        const placeOrderFacade = PlaceOrderFacadeFactory.create({
            clientAdmFacade: clientAdmFacadeMock,
        });

        clientAdmFacadeMock.findById.mockResolvedValue({
            id: '1',
            name: 'Sandra',
            email: 'sandra@test.com',
            documentType: 'CPF',
            document: '08.738.030-00',
            street: 'Paulista',
            number: '3',
            complement: 'Predio',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '01013-201',
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const input: PlaceOrderInputDto = {
            clientId: '1',
            document: '08.738.030-01',
            products: [{ productId: '1', quantity: 1 }],
        };

        await expect(placeOrderFacade.addOrder(input)).rejects.toThrow(new NotFoudException('Client ID and document do not match.'));
    });

    it('should throw an error add order when client must provide either id or document', async () => {

        const clientAdmFacadeMock = mock<ClientAdmFacadeInterface>();

        const placeOrderFacade = PlaceOrderFacadeFactory.create({
            clientAdmFacade: clientAdmFacadeMock,
        });

        clientAdmFacadeMock.findById.mockResolvedValue({
            id: '1',
            name: 'Sandra',
            email: 'sandra@test.com',
            documentType: 'CPF',
            document: '08.738.030-00',
            street: 'Paulista',
            number: '3',
            complement: 'Predio',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '01013-201',
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const input: PlaceOrderInputDto = {
            clientId: '',
            document: '',
            products: [{ productId: '1', quantity: 1 }],
        };

        await expect(placeOrderFacade.addOrder(input)).rejects.toThrow(new NotFoudException('You must provide either id or document.'));
    });

    it('should throw an error add order if no products are selected', async () => {

        const clientAdmFacadeMock = mock<ClientAdmFacadeInterface>();
        const productFacadeMock = mock<ProductAdmFacadeInterface>();

        const placeOrderFacade = PlaceOrderFacadeFactory.create({
            clientAdmFacade: clientAdmFacadeMock,
            productFacade: productFacadeMock,
        });

        clientAdmFacadeMock.findById.mockResolvedValue({
            id: '1',
            name: 'Sandra',
            email: 'sandra@test.com',
            documentType: 'CPF',
            document: '08.738.030-00',
            street: 'Paulista',
            number: '3',
            complement: 'Predio',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '01013-201',
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const input: PlaceOrderInputDto = {
            clientId: '1',
            document: '08.738.030-00',
            products: [],
        };

        await expect(placeOrderFacade.addOrder(input)).rejects.toThrow(new BadRequestException('No products selected.'));
    });

    it('should throw an error add order when product is not available in stock', async () => {

        const clientAdmFacadeMock = mock<ClientAdmFacadeInterface>();
        const productFacadeMock = mock<ProductAdmFacadeInterface>();

        const placeOrderFacade = PlaceOrderFacadeFactory.create({
            clientAdmFacade: clientAdmFacadeMock,
            productFacade: productFacadeMock,
        });

        clientAdmFacadeMock.findById.mockResolvedValue({
            id: '1',
            name: 'Sandra',
            email: 'sandra@test.com',
            documentType: 'CPF',
            document: '08.738.030-00',
            street: 'Paulista',
            number: '3',
            complement: 'Predio',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '01013-201',
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        productFacadeMock.checkStock.mockResolvedValue({ productId: '1', stock: 0 });

        const input: PlaceOrderInputDto = {
            clientId: '1',
            document: '08.738.030-00',
            products:  [{ productId: '1', quantity: 1 }],
        };

        await expect(placeOrderFacade.addOrder(input)).rejects.toThrow(new ConflictException(`Product ${input.products[0].productId} is not available in stock.`));
    });

    it('should throw an error add order when product not found', async () => {

        const clientAdmFacadeMock = mock<ClientAdmFacadeInterface>();
        const productFacadeMock = mock<ProductAdmFacadeInterface>();
        const catalogFacadeMock = mock<StoreCatalogFacadeInterface>();

        const placeOrderFacade = PlaceOrderFacadeFactory.create({
            clientAdmFacade: clientAdmFacadeMock,
            productFacade: productFacadeMock,
            catalogFacade: catalogFacadeMock,
        });

        clientAdmFacadeMock.findById.mockResolvedValue({
            id: '1',
            name: 'Sandra',
            email: 'sandra@test.com',
            documentType: 'CPF',
            document: '08.738.030-00',
            street: 'Paulista',
            number: '3',
            complement: 'Predio',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '01013-201',
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        productFacadeMock.checkStock.mockResolvedValue({ productId: '1', stock: 3 });

        catalogFacadeMock.find.mockResolvedValue(null);

        const input: PlaceOrderInputDto = {
            clientId: '1',
            document: '08.738.030-00',
            products:  [{ productId: '1', quantity: 1 }],
        };

        await expect(placeOrderFacade.addOrder(input)).rejects.toThrow(new NotFoudException(`Product ${input.products[0].productId} not found.`));
    });

    it('should place add an approved order', async () => {

        const clientAdmFacadeMock = mock<ClientAdmFacadeInterface>();
        const productFacadeMock = mock<ProductAdmFacadeInterface>();
        const catalogFacadeMock = mock<StoreCatalogFacadeInterface>();
        const orderRepositoryMock = mock<CheckoutGateway>();
        const invoiceFacadeMock = mock<InvoiceFacadeInterface>();
        const paymentFacadeMock = mock<PaymentFacadeInterface>();

        const placeOrderFacade = PlaceOrderFacadeFactory.create({
            clientAdmFacade: clientAdmFacadeMock,
            productFacade: productFacadeMock,
            catalogFacade: catalogFacadeMock,
            orderRepository: orderRepositoryMock,
            invoiceFacade: invoiceFacadeMock,
            paymentFacade: paymentFacadeMock,
        });

        clientAdmFacadeMock.findById.mockResolvedValue({
            id: '1',
            name: 'Sandra',
            email: 'sandra@test.com',
            documentType: 'CPF',
            document: '08.738.030-00',
            street: 'Paulista',
            number: '3',
            complement: 'Predio',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '01013-201',
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        productFacadeMock.checkStock.mockResolvedValue({ productId: '1', stock: 10 });

        catalogFacadeMock.find.mockResolvedValue({
            id: '1',
            name: 'Product 1',
            description: 'Product 1 description',
            salesPrice: 100,
        });

        paymentFacadeMock.process.mockResolvedValue({
            transactionId: '1',
            orderId: '1',
            amount: 100,
            status: 'approved',
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const products: { id: string, name: string, salesPrice: number, quantity: number }[] = [
            { id: '1', name: 'Product 1',  salesPrice: 100, quantity: 1 },
        ];

        invoiceFacadeMock.generate.mockResolvedValue({
            id: '1',
            name: 'Sandra',
            document: '08.738.030-00',
            street: 'Paulista',
            number: '3',
            complement: 'Predio',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '01013-201',
            items: products.map((p) => {
                return {
                    id: p.id,
                    name: p.name,
                    price: p.salesPrice,
                    quantity: p.quantity,
                };
              }),
            total: 100,
        });

        const input: PlaceOrderInputDto = {
            clientId: '1',
            document: '08.738.030-00',
            products: [
              { productId: '1', quantity: 1 },
            ],
        };

        const output = await placeOrderFacade.addOrder(input);

        expect(output.invoiceId).toBe('1');
        expect(output.total).toBe(100);
        expect(output.status).toBe('approved');
        expect(output.items).toHaveLength(1);
        expect(orderRepositoryMock.addOrder).toHaveBeenCalled();
    });

    it('should place add is declined order', async () => {

        const clientAdmFacadeMock = mock<ClientAdmFacadeInterface>();
        const productFacadeMock = mock<ProductAdmFacadeInterface>();
        const catalogFacadeMock = mock<StoreCatalogFacadeInterface>();
        const orderRepositoryMock = mock<CheckoutGateway>();
        const invoiceFacadeMock = mock<InvoiceFacadeInterface>();
        const paymentFacadeMock = mock<PaymentFacadeInterface>();

        const placeOrderFacade = PlaceOrderFacadeFactory.create({
            clientAdmFacade: clientAdmFacadeMock,
            productFacade: productFacadeMock,
            catalogFacade: catalogFacadeMock,
            orderRepository: orderRepositoryMock,
            invoiceFacade: invoiceFacadeMock,
            paymentFacade: paymentFacadeMock,
        });

        clientAdmFacadeMock.findById.mockResolvedValue({
            id: '1',
            name: 'Sandra',
            email: 'sandra@test.com',
            documentType: 'CPF',
            document: '08.738.030-00',
            street: 'Paulista',
            number: '3',
            complement: 'Predio',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '01013-201',
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        productFacadeMock.checkStock.mockResolvedValue({ productId: '1', stock: 10 });

        catalogFacadeMock.find.mockResolvedValue({
            id: '1',
            name: 'Product 1',
            description: 'Product 1 description',
            salesPrice: 10,
        });
 
        paymentFacadeMock.process.mockResolvedValue({
            transactionId: '1',
            orderId: '1',
            amount: 10,
            status: 'declined',
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const products: { id: string, name: string, salesPrice: number, quantity: number }[] = [
            { id: '1', name: 'Product 1',  salesPrice: 10, quantity: 1 },
        ];

        invoiceFacadeMock.generate.mockResolvedValue({
            id: '1',
            name: 'Sandra',
            document: '08.738.030-00',
            street: 'Paulista',
            number: '3',
            complement: 'Predio',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '01013-201',
            items: products.map((p) => {
                return {
                    id: p.id,
                    name: p.name,
                    price: p.salesPrice,
                    quantity: p.quantity,
                };
              }),
            total: 10,
        });

        const input: PlaceOrderInputDto = {
            clientId: '1',
            document: '08.738.030-00',
            products: [
              { productId: '1', quantity: 1 },
            ],
        };

        const output = await placeOrderFacade.addOrder(input);

        expect(output.invoiceId).toBeNull();
        expect(output.total).toBe(10);
        expect(output.status).toBe('declined');
        expect(output.items).toHaveLength(1);
        expect(orderRepositoryMock.addOrder).toHaveBeenCalled();
    });

    it('should find place order by id', async () => {

        const orderRepositoryMock = mock<CheckoutGateway>();
        const invoiceFacadeMock = mock<InvoiceFacadeInterface>();

        const placeOrderFacade = PlaceOrderFacadeFactory.create({
            orderRepository: orderRepositoryMock,
            invoiceFacade: invoiceFacadeMock,
        });

        const invoice = {
            id: '1',
            name: 'Sandra',
            document: '08.738.030-00',
            street: 'Paulista',
            number: '3',
            complement: 'Predio',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '01212-100',
            items: [{  id: '1', name: 'Note Book',  price: 8000.00,  quantity: 1}],
            total: 8000.00,
            createdAt: new Date(),
        };

        invoiceFacadeMock.generate.mockResolvedValue(invoice);

        invoiceFacadeMock.find.mockResolvedValue({
            id: '1',
            name: 'Sandra',
            document: '08.738.030-00',
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
        });

        const product = new Product({
            id: new ProductId('1'),
            name: 'Note book',
            description: 'Note book',
            salesPrice: 100,
            quantity: 1,
        });

        const order = new Order({
            id: new OrderId('1'),
            clientId: '1',
            products: [product],
            status: 'approved',
            invoiceId: '1',
            createdAt: new Date(),
        });

        orderRepositoryMock.findOrderById.mockResolvedValue(order);

        const input = { id: '1' };

        const output = await placeOrderFacade.findOrderById(input);

        expect(orderRepositoryMock.findOrderById).toHaveBeenCalled();
        expect(output.id).not.toBeNull();
        expect(output.invoiceId).toBe(order.invoiceId);
        expect(output.status).toBe(order.status);
        expect(output.clientId).toBe(order.clientId);
        expect(output.status).toBe(order.status);
        expect(output.total).toBe(order.products.reduce((total, product) => total + (product.salesPrice * product.quantity), 0));

        expect(output.items).toHaveLength(1);
        expect(output.items.length).toBe(1);

        output.items.forEach((item, index) => {

          let expectedItem = order.products[index];

          expect(item.productId).toBe(expectedItem.id.id);
          expect(item.name).toBe(expectedItem.name);
          expect(item.salesPrice).toBe(expectedItem.salesPrice);
          expect(item.quantity).toBe(expectedItem.quantity);
        });
    });

    it('should find place order by document', async () => {

        const orderRepositoryMock = mock<CheckoutGateway>();
        const invoiceFacadeMock = mock<InvoiceFacadeInterface>();
        const clientAdmFacadeMock = mock<ClientAdmFacadeInterface>();

        const placeOrderFacade = PlaceOrderFacadeFactory.create({
            orderRepository: orderRepositoryMock,
            invoiceFacade: invoiceFacadeMock,
            clientAdmFacade: clientAdmFacadeMock,
        });

        clientAdmFacadeMock.findByDocument.mockResolvedValue({
            id: '1',
            name: 'Sandra',
            email: 'sandra@test.com',
            documentType: 'CPF',
            document: '08.738.030-00',
            street: 'Paulista',
            number: '3',
            complement: 'Predio',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '01212-100',
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        invoiceFacadeMock.listByIds.mockResolvedValue([{
            id: '1',
            name: 'Sandra',
            document: '08.738.030-00',
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
        }]);

        const product = new Product({
            id: new ProductId('1'),
            name: 'Note book',
            description: 'Note book',
            salesPrice: 100,
            quantity: 1,
        });

        const order = new Order({
            id: new OrderId('1'),
            clientId: '1',
            products: [product],
            status: 'approved',
            invoiceId: '1',
            createdAt: new Date(),
        });

        orderRepositoryMock.findOrdersByClientId.mockResolvedValue([order]);

        const input = { document: '08.738.030-00' };

        const output = await placeOrderFacade.findPlaceOrderByDocument(input);

        expect(orderRepositoryMock.findOrdersByClientId).toHaveBeenCalled();

        expect(output).not.toBeNull();
        expect(output.length).toBe(1);

        expect(output[0].id).not.toBeNull();
        expect(output[0].invoiceId).toBe(order.invoiceId);
        expect(output[0].status).toBe(order.status);
        expect(output[0].clientId).toBe(order.clientId);
        expect(output[0].status).toBe(order.status);
        expect(output[0].total).toBe(order.products.reduce((total, product) => total + (product.salesPrice * product.quantity), 0));

        expect(output[0].items).toHaveLength(1);
        expect(output[0].items.length).toBe(1);

        output[0].items.forEach((item, index) => {

          let expectedItem = order.products[index];

          expect(item.productId).toBe(expectedItem.id.id);
          expect(item.name).toBe(expectedItem.name);
          expect(item.salesPrice).toBe(expectedItem.salesPrice);
          expect(item.quantity).toBe(expectedItem.quantity);
        });
    });

    it('should throw error when find a place order by document when not found', async () => {

        const orderRepositoryMock = mock<CheckoutGateway>();
        const invoiceFacadeMock = mock<InvoiceFacadeInterface>();
        const clientAdmFacadeMock = mock<ClientAdmFacadeInterface>();

        const placeOrderFacade = PlaceOrderFacadeFactory.create({
            orderRepository: orderRepositoryMock,
            invoiceFacade: invoiceFacadeMock,
            clientAdmFacade: clientAdmFacadeMock,
        });

        clientAdmFacadeMock.findByDocument.mockResolvedValue({
            id: '1',
            name: 'Sandra',
            email: 'sandra@test.com',
            documentType: 'CPF',
            document: '08.738.030-00',
            street: 'Paulista',
            number: '3',
            complement: 'Predio',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '01212-100',
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        orderRepositoryMock.findOrdersByClientId.mockResolvedValue([]);

        const input = { document: '08.738.030-00' };

        await expect(placeOrderFacade.findPlaceOrderByDocument(input)).rejects.toThrow(new NotFoudException(`No orders found for document ${input.document}.`));
    });

    it('should throw error when find a place order by id when not found', async () => {

        const orderRepositoryMock = mock<CheckoutGateway>();
        const invoiceFacadeMock = mock<InvoiceFacadeInterface>();

        const placeOrderFacade = PlaceOrderFacadeFactory.create({
            orderRepository: orderRepositoryMock,
            invoiceFacade: invoiceFacadeMock,
        });

        orderRepositoryMock.findOrderById.mockResolvedValue(null);

        const input = { id: '1' };

        await expect(placeOrderFacade.findOrderById(input)).rejects.toThrow(new NotFoudException(`No order found for id ${input.id}.`));
    });
});