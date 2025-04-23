import Product from "../../domain/product";
import CheckStockProductUseCase from "./check-stock.usecase";
import Id from "../../../@shared/domain/value-object/id.value-object";

const product = new Product({
    id: new Id('1'),
    name: 'Product 1',
    description: 'Prodict 1 description',
    purchasePrice: 100,
    stock: 10,
});

const MockRepository = () => {
    return {
        add: jest.fn(),
        find: jest.fn().mockResolvedValue(Promise.resolve(product))
    };
};

describe("CheckStock usecase unit test", () => {

    it('should get stock of a product', async () => {

        const productRepository = MockRepository();
        const useCase = new CheckStockProductUseCase(productRepository);

        const input = {
            productId: '1',
        };

        const result = await useCase.execute(input);

        expect(productRepository.find).toHaveBeenCalledTimes(1);
        expect(result).not.toBeNull();
        expect(result.productId).toBe('1');
        expect(result.stock).toBe(10);
    });
});