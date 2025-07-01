import Product from "../../domain/product";
import CheckStockProductUseCase from "./check-stock.usecase";
import Id from "@shared/domain/value-object/id.value-object";
import { NotFoudException } from "@shared/domain/validation/not-found.exception";

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
        find: jest.fn().mockResolvedValue(Promise.resolve(product)),
        existsById: jest.fn(),
    };
};

describe("CheckStockUseCase (unit test)", () => {

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

    it('should throw error when product not found', async () => {

        const productRepository = {
            add: jest.fn(),
            find: jest.fn().mockImplementation(() => {
                throw new NotFoudException('Product with id 2 not found');
            }),
            existsById: jest.fn(),
        };

        const input = {
            productId: '2',
        };

        const useCase = new CheckStockProductUseCase(productRepository);

        await expect(useCase.execute(input))
            .rejects
            .toThrow(new NotFoudException('Product with id 2 not found'));
    });
});