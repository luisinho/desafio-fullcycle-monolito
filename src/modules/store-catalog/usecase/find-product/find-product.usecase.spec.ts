import Product from "../../domain/product.entity";
import FindProductUseCase from "./find-product.usecase";
import Id from "@shared/domain/value-object/id.value-object";

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
});