import Product from "../../domain/product.entity";
import Id from "@shared/domain/value-object/id.value-object";
import FindAllProductsUseCase from "./find-all-products.usecase";
import { NotFoudException } from "@shared/domain/validation/not-found.exception";

const product1 = new Product({
    id: new Id('1'),
    name: 'Product 1',
    description: 'description 1',
    salesPrice: 100,
});

const product2 = new Product({
    id: new Id('2'),
    name: 'Product 2',
    description: 'description 2',
    salesPrice: 100,
});

const MockRepository = () => {
    return {
        find: jest.fn(),
        findAll: jest.fn().mockReturnValue(Promise.resolve([product1, product2])),
    };
};

describe("FindAllProductsUseCase (unit test)", () => {

    it('should find all products', async () => {

        const productRepository = MockRepository();
        const useCase = new FindAllProductsUseCase(productRepository);

        const result = await useCase.execute();

        expect(productRepository.findAll).toHaveBeenCalled();
        expect(result.length).toBe(2);
        expect(result[0].id).toBe('1');
        expect(result[0].name).toBe('Product 1');
        expect(result[0].description).toBe('description 1');
        expect(result[0].salesPrice).toBe(100);
        expect(result[1].id).toBe('2');
        expect(result[1].name).toBe('Product 2');
        expect(result[1].description).toBe('description 2');
        expect(result[1].salesPrice).toBe(100);
    });

    it('should throw error when products not found in the store catalog', async () => {

        const productRepository = {
            find: jest.fn(),
            findAll: jest.fn().mockImplementation(() => {
                throw new NotFoudException('Products not found in the store catalog.');
            }),
        };

        const useCase = new FindAllProductsUseCase(productRepository);

        await expect(useCase.execute())
            .rejects
            .toThrow(new NotFoudException('Products not found in the store catalog.'));
    });
});