import { mock } from "jest-mock-extended";

import CheckoutGateway from "../../checkout/gateway/checkout.gateway";
import PaymentFacadeInterface from "../../payment/facade/facade.interface";
import { PlaceOrderInputDto } from "../facade/place-order.facade.interface";
import PlaceOrderFacadeFactory from "../factory/place-order.facade.factory";
import InvoiceFacadeInterface from "../../invoice/facade/invoice-facade.interface";
import ClientAdmFacadeInterface from "../../client-adm/facade/client-adm.facade.interface";
import ProductAdmFacadeInterface from "../../product-adm/facade/product-adm.facade.interface";
import StoreCatalogFacadeInterface from "../../store-catalog/facade/store-catalog.facade.interface";

describe("PlaceOrderFacade (unit)", () => {

    it("should place an order", async () => {

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
            orderRepository: orderRepositoryMock, // <--
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
            address: '',
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

        const products: { id: string, name: string, salesPrice: number }[] = [
            { id: '1', name: 'Product 1',  salesPrice: 100},
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
                    price: p.salesPrice
                };
              }),
              total: 100,
           });
        

        const input: PlaceOrderInputDto = {
              clientId: '1',
              document: '08.738.030-00',
              products: [
                { productId: '1' },
              ],
        };

        const output = await placeOrderFacade.addOrder(input);

        expect(output.invoiceId).toBe('1');
        expect(output.total).toBe(100);
        expect(output.status).toBe('approved');
        expect(output.products).toHaveLength(1);
        expect(orderRepositoryMock.addOrder).toHaveBeenCalled();
    });
});
