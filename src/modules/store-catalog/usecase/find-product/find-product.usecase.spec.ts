import Product from "../../domain/product.entity";
import FindProductUseCase from "./find-product.usecase";
import Id from "@shared/domain/value-object/id.value-object";
import { NotFoudException } from "@shared/domain/validation/not-found.exception";

const product = new Product({
    id: new Id('1'),
    name: 'Product 1',
    description: 'Description 1',
    salesPrice: 100,
});

const MockRepository = () => {
    return {
        find: jest.fn().mockReturnValue(Promise.resolve(product)),
        findAll: jest.fn(),
    }
};

describe("FindProductUseCase (unit test)", () => {

    it('should find a product', async () => {

        const productRepository = MockRepository();
        const useCase = new FindProductUseCase(productRepository);

        const input = {
            id: '1',
        };

        const result = await useCase.execute(input);

        expect(productRepository.find).toHaveBeenCalled();        
        expect(result.id).toBe('1');
        expect(result.name).toBe('Product 1');
        expect(result.description).toBe('Description 1');
        expect(result.salesPrice).toBe(100);
    });

    it('should throw error when product with an id not found in the store catalog', async () => {

        const input = {
            id: '1',
        };

        const productRepository = {
            findAll: jest.fn(),
            find: jest.fn().mockImplementation(() => {
                throw new NotFoudException(`Product with id ${input.id} not in the store catalog`);
            }),
        };

        const useCase = new FindProductUseCase(productRepository);

        await expect(useCase.execute(input))
            .rejects
            .toThrow(new NotFoudException(`Product with id ${input.id} not in the store catalog`));
    });
});