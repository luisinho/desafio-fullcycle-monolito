import PlaceOrderUseCase from "./place-order.usecase";
import { PlaceOrderInputDto } from "./place-order.dto";
import Product, { ProductId } from "../../domain/product.entity";
import { NotFoudException } from "@shared/domain/validation/not-found.exception";

const mockDate = new Date(2000, 1, 1);

describe("PlaceOrderUseCase unit test", () => {

    describe("validateProducts method", () => {

        //@ts-expect-error - no params in constructor
        const placeOrderUseCase = new PlaceOrderUseCase();

        it('should throw error if no products are selected', async () => {

            const input: PlaceOrderInputDto = { 
                clientId: '0',
                document: '0',
                products: [] 
            };

            await expect(
                placeOrderUseCase['validateProducts'](input)
            ).rejects.toThrow(new Error('No products selected.'));
        });

        it('should throw an error when product is out of stock', async () => {
            const mockProducFacade = {
                checkStock: jest.fn(({productId}: {productId: string}) => {
                    return Promise.resolve({
                        productId,
                        stock: productId === '1' ? 0 : 1,
                    })
                }),
            };

            //@ts-expect-error - force set mockProducFacade
            placeOrderUseCase['_productFacade'] = mockProducFacade;

            let input: PlaceOrderInputDto = {
                clientId: '0',
                document: '0',
                products: [{ productId: '1'}],
            };

            await expect(placeOrderUseCase['validateProductsStock'](input)
            ).rejects.toThrow(new Error('Product 1 is not available in stock.'));

            input = {
                clientId: '0',
                document: '0',
                products: [{ productId: '0'}, { productId: '1'}],
            };

            await expect(placeOrderUseCase['validateProductsStock'](input)
            ).rejects.toThrow(new Error('Product 1 is not available in stock.'));
            expect(mockProducFacade.checkStock).toHaveBeenCalledTimes(3);

            input = {
                clientId: '0',
                document: '0',
                products: [{ productId: '0'}, { productId: '1'}, { productId: '2'}],
            };

            await expect(placeOrderUseCase['validateProductsStock'](input)
            ).rejects.toThrow(new Error('Product 1 is not available in stock.'));
            expect(mockProducFacade.checkStock).toHaveBeenCalledTimes(5);
        });
    });

    describe('getProducts method', () => {

        beforeAll(() => {
            jest.useFakeTimers('modern');
            jest.setSystemTime(mockDate);
        });

        afterAll(() => {
            jest.useRealTimers();
        });

        //@ts-expect-error - no params in constructor
        const placeOrderUseCase = new PlaceOrderUseCase();

        it('should throw an error when product not found', async () => {

            const mockCatalogFacade = {
                find: jest.fn().mockResolvedValue(null),
            };

            //@ts-expect-error - force set catalogFacade
            placeOrderUseCase['_catalogFacade'] = mockCatalogFacade;

            await expect(placeOrderUseCase['getProduct']('0')).rejects.toThrow(
                new Error('Product 0 not found.')
            );

        });

        it('should return a product', async () => {

            const mockCatalogFacade = {
                find: jest.fn().mockResolvedValue({
                  id: '0',
                  name: 'Product 0',
                  description: 'Product 0 description',
                  salesPrice: 0,
                }),
            };

            //@ts-expect-error - force set catalogFacade
            placeOrderUseCase['_catalogFacade'] = mockCatalogFacade;

            await expect(placeOrderUseCase['getProduct']('0')).resolves.toEqual(
                new Product({
                  id: new ProductId('0'),
                  name: 'Product 0',
                  description: 'Product 0 description',
                  salesPrice: 0,
                })
            );
            expect(mockCatalogFacade.find).toHaveBeenCalledTimes(1);
        });
    });

    describe("execute method", () => {

        beforeAll(() => {
            jest.useFakeTimers('modern');
            jest.setSystemTime(mockDate);
        });

        afterAll(() => {
            jest.useRealTimers();
        });

        it('should throw an error when client by id not found', async () => {

            const input: PlaceOrderInputDto = { clientId: '0', document: '', products: [] };

            const mockClientFinderService = {
                find: jest.fn().mockRejectedValue(
                    new NotFoudException(`Client with id ${input.clientId} not found.`)
                ),
            };

            //@ts-expect-error - no params in constructor
            const placeOrderUseCase = new PlaceOrderUseCase();
            //@ts-expect-error - force set clientFinderService
            placeOrderUseCase['_clientFinderService'] = mockClientFinderService;

            await expect(placeOrderUseCase.execute(input)).rejects.toThrow(
                new NotFoudException(`Client with id ${input.clientId} not found.`)
            );

            expect(mockClientFinderService.find).toHaveBeenCalledWith({ id: input.clientId, document: input.document });
        });

        it('should throw an error when client by document not found', async () => {

            const input: PlaceOrderInputDto = { clientId: '', document: '0', products: [] };

            const mockClientFinderService = {
                find: jest.fn().mockRejectedValue(
                    new NotFoudException(`Client with document ${input.document} not found.`)
                ),
            };

            //@ts-expect-error - no params in constructor
            const placeOrderUseCase = new PlaceOrderUseCase();
            //@ts-expect-error - force set clientFinderService
            placeOrderUseCase['_clientFinderService'] = mockClientFinderService;

            await expect(placeOrderUseCase.execute(input)).rejects.toThrow(
                new NotFoudException(`Client with document ${input.document} not found.`)
            );

            expect(mockClientFinderService.find).toHaveBeenCalledWith({ id: input.clientId, document: input.document });
        });

        it('should throw an error add order when clientId and document do not match', async () => {
            const input: PlaceOrderInputDto = { clientId: '1', document: '99999999999', products: [] };
        
            const mockClientFinderService = {
                find: jest.fn().mockRejectedValue(
                    new NotFoudException('Client ID and document do not match.')
                ),
            };
        
            //@ts-expect-error - no params in constructor
            const placeOrderUseCase = new PlaceOrderUseCase();
            //@ts-expect-error - force set clientFinderService
            placeOrderUseCase['_clientFinderService'] = mockClientFinderService;
        
            await expect(placeOrderUseCase.execute(input)).rejects.toThrow(
                new NotFoudException('Client ID and document do not match.')
            );
            expect(mockClientFinderService.find).toHaveBeenCalledWith({ id: '1', document: '99999999999' });
        });

        it('should throw an error when neither clientId nor document is provided', async () => {
            const input: PlaceOrderInputDto = { clientId: '', document: '', products: [] };
        
            const mockClientFinderService = {
                find: jest.fn().mockRejectedValue(
                    new NotFoudException('You must provide either id or document.')
                ),
            };
        
            //@ts-expect-error - no params in constructor
            const placeOrderUseCase = new PlaceOrderUseCase();
            //@ts-expect-error - force set clientFinderService
            placeOrderUseCase['_clientFinderService'] = mockClientFinderService;
        
            await expect(placeOrderUseCase.execute(input)).rejects.toThrow(
                new NotFoudException('You must provide either id or document.')
            );
            expect(mockClientFinderService.find).toHaveBeenCalledWith({ id: '', document: '' });
        });        

        it('should throw an error when products are not valid', async () => {

            const mockClientFinderService = {
                find: jest.fn().mockResolvedValue(true),
            };

            //@ts-expect-error - no params in constructor
            const placeOrderUseCase = new PlaceOrderUseCase();

            const mockValidateProducts = jest

            //@ts-expect-error - spy on private method
            .spyOn(placeOrderUseCase, 'validateProducts')
            //@ts-expect-error - not return never
            .mockRejectedValue(new Error('No products selected.'));

            //@ts-expect-error - force set clientFinderService;
            placeOrderUseCase['_clientFinderService'] = mockClientFinderService;

            const input: PlaceOrderInputDto = { clientId: '1', document: '1', products: [] };
            await expect(placeOrderUseCase.execute(input)).rejects.toThrow(
                new Error('No products selected.')
            );
            expect(mockValidateProducts).toHaveBeenCalledTimes(1);
        });

        describe("place an order", () => {

            const clientProps = {
                id: '1',
                name: 'Sandra',
                document: '308.738.030-00',
                street: 'Paulista',
                number: '3',
                complement: 'Predio',
                city: 'São Paulo',
                state: 'São Paulo',
                zipCode: '01212-100',
            };

            const mockClientFacade = {
                findById: jest.fn().mockResolvedValue(clientProps),
            };

            const mockPaymentFacade = {
                process: jest.fn(),
            };

            const mockCheckoutRepo = {
                addOrder: jest.fn(),
            };

            const mockInvoiceFacade = {
                generate: jest.fn().mockResolvedValue({id: '1'}),
            };

            const mockClientFinderService = {
                find: jest.fn().mockResolvedValue(clientProps),
            }

            const placeOrderUseCase = new PlaceOrderUseCase(
                // mockClientFacade as any,
                null,
                null,
                mockCheckoutRepo as any,
                mockInvoiceFacade as any,
                mockPaymentFacade,
                mockClientFinderService as any,
            );

            const products = {
                '1': new Product({
                    id: new ProductId('1'),
                    name: 'Product 1',
                    description: 'some description',
                    salesPrice: 40,
                }),
                '2': new Product({
                    id: new ProductId('2'),
                    name: 'Product 2',
                    description: 'some description',
                    salesPrice: 40,
                }),
            };

            const mockValidateProducts = jest
            //@ts-expect-error - spy on private method
            .spyOn(placeOrderUseCase, 'validateProducts')
            //@ts-expect-error - spy on private method
            .mockResolvedValue(null);

            const mockValidateProductsStock = jest
            //@ts-expect-error - spy on private method
            .spyOn(placeOrderUseCase, 'validateProductsStock')
            //@ts-expect-error - spy on private method
            .mockResolvedValue(null);

            const mockGetProduct = jest
            //@ts-expect-error - spy on private method
            .spyOn(placeOrderUseCase, 'getProduct')
            //@ts-expect-error - spy on private method
            .mockImplementation((productId: keyof typeof products) => {
                return products[productId];
            });

            it('should not be approved', async () => {

                mockPaymentFacade.process = mockPaymentFacade.process.mockReturnValue({
                    transactionId: '1',
                    orderId: '1',
                    amount: 100,
                    status: 'error',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });

                const input: PlaceOrderInputDto = {
                    clientId: '1',
                    document: '308.738.030-00',
                    products: [{productId: '1'}, {productId: '2'}],
                };

                let output = await placeOrderUseCase.execute(input);

                expect(output.invoiceId).toBeNull();
                expect(output.total).toBe(80);
                expect(output.products).toStrictEqual([
                    { productId: '1' },
                    { productId: '2' },
                ]);
                expect(mockClientFinderService.find).toHaveBeenCalledTimes(1);
                expect(mockClientFinderService.find).toHaveBeenCalledWith({ id: '1', document: '308.738.030-00'});
                expect(mockValidateProducts).toHaveBeenCalledTimes(1);
                expect(mockValidateProductsStock).toHaveBeenCalledTimes(1);
                expect(mockValidateProducts).toHaveBeenCalledWith(input);
                expect(mockGetProduct).toHaveBeenCalledTimes(2);
                expect(mockCheckoutRepo.addOrder).toHaveBeenCalledTimes(1);
                expect(mockPaymentFacade.process).toHaveBeenCalledTimes(1);
                expect(mockPaymentFacade.process).toHaveBeenCalledWith({
                    orderId: output.id,
                    amount: output.total,
                });

                expect(mockInvoiceFacade.generate).toHaveBeenCalledTimes(0);
            });

            it('should be approved', async () => {

                mockPaymentFacade.process = mockPaymentFacade.process.mockReturnValue({
                    transactionId: '1',
                    orderId: '1',
                    amount: 100,
                    status: 'approved',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });

                const input: PlaceOrderInputDto = {
                    clientId: '1',
                    document: '308.738.030-00',
                    products: [{productId: '1'}, {productId: '2'}],
                };

                let output = await placeOrderUseCase.execute(input);

                expect(output.invoiceId).toBe('1');
                expect(output.total).toBe(80);
                expect(output.products).toStrictEqual([
                    { productId: '1' },
                    { productId: '2' },
                ]);
                expect(mockClientFinderService.find).toHaveBeenCalledTimes(1);
                expect(mockClientFinderService.find).toHaveBeenCalledWith({ id: '1', document: '308.738.030-00'});
                expect(mockValidateProducts).toHaveBeenCalledTimes(1);
                expect(mockValidateProductsStock).toHaveBeenCalledTimes(1);                
                expect(mockGetProduct).toHaveBeenCalledTimes(2);
                expect(mockCheckoutRepo.addOrder).toHaveBeenCalledTimes(1);
                expect(mockPaymentFacade.process).toHaveBeenCalledTimes(1);
                expect(mockPaymentFacade.process).toHaveBeenCalledWith({
                    orderId: output.id,
                    amount: output.total,
                });
                expect(mockInvoiceFacade.generate).toHaveBeenCalledTimes(1);
                expect(mockInvoiceFacade.generate).toHaveBeenCalledWith({
                    name: clientProps.name,
                    document: clientProps.document,
                    street: clientProps.street,
                    number: clientProps.number,
                    complement: clientProps.complement,
                    city: clientProps.city,
                    state: clientProps.state,
                    zipCode: clientProps.zipCode,
                    items: [
                        {
                           id: products['1'].id.id,
                           name: products['1'].name,
                           price: products['1'].salesPrice,
                        },
                        {
                           id: products['2'].id.id,
                           name: products['2'].name,
                           price: products['2'].salesPrice,
                        }
                    ]
                });
            });
        });
    });
});