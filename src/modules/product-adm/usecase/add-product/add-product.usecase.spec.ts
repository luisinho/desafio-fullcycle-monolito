import AddProductUsecase from "./add-product.usecase";
import { ConflictException } from "@shared/domain/validation/conflict.exception";
import { ValidationException } from "@shared/domain/validation/validation.exception";

const MockRepository = () => {
    return {
        add: jest.fn(),
        find: jest.fn(),
        existsById: jest.fn(),
    };
}

describe("AddProductUsecase (unit test)", () => {

    it('should add a product', async () => {

        const productRepository = MockRepository();
        const useCase = new AddProductUsecase(productRepository);

        const input = {
            name: 'Product 1',
            description: 'Product 1 description',
            purchasePrice: 100,
            stock: 10,
        };

        const result = await useCase.execute(input);

        expect(productRepository.add).toHaveBeenCalled();
        expect(result.id).toBeDefined();
        expect(result.name).toBe(input.name);
        expect(result.description).toBe(input.description);
        expect(result.purchasePrice).toBe(input.purchasePrice);
        expect(result.stock).toBe(input.stock);
    });

    it('should throw an error when product name is empty', async () => {

        const productRepository = MockRepository();
        const useCase = new AddProductUsecase(productRepository);

        const input = {
            name: '',
            description: 'Product 1 description',
            purchasePrice: 100,
            stock: 10,
        };

        await expect(useCase.execute(input)).rejects.toThrow(ValidationException);

        await expect(useCase.execute(input)).rejects.toMatchObject({
            errors: expect.arrayContaining([
                expect.objectContaining({
                    field: 'name',
                    message: 'Name is required.',
                }),
            ]),
        });
    });

    it('should throw an error when product name is less than 3 characters', async () => {

        const productRepository = MockRepository();
        const useCase = new AddProductUsecase(productRepository);

        const input = {
            name: 'Ab',
            description: 'Product 1 description',
            purchasePrice: 100,
            stock: 10,
        };

        await expect(useCase.execute(input)).rejects.toThrow(ValidationException);

        await expect(useCase.execute(input)).rejects.toMatchObject({
            errors: expect.arrayContaining([
                expect.objectContaining({
                    field: 'name',
                    message: 'Name must be at least 3 characters long.',
                }),
            ]),
        });
    });

    it('should throw an error when product description is empty', async () => {

        const productRepository = MockRepository();
        const useCase = new AddProductUsecase(productRepository);

        const input = {
            name: 'Product 1',
            description: '',
            purchasePrice: 100,
            stock: 10,
        };

        await expect(useCase.execute(input)).rejects.toThrow(ValidationException);

        await expect(useCase.execute(input)).rejects.toMatchObject({
            errors: expect.arrayContaining([
                expect.objectContaining({
                    field: 'description',
                    message: 'Description is required.',
                }),
            ]),
        });
    });

    it('should throw an error when product description is less than 5 characters', async () => {

        const productRepository = MockRepository();
        const useCase = new AddProductUsecase(productRepository);

        const input = {
            name: 'Product 1',
            description: 'Prod',
            purchasePrice: 100,
            stock: 10,
        };

        await expect(useCase.execute(input)).rejects.toThrow(ValidationException);

        await expect(useCase.execute(input)).rejects.toMatchObject({
            errors: expect.arrayContaining([
                expect.objectContaining({
                    field: 'description',
                    message: 'Description must be at least 5 characters long.',
                }),
            ]),
        });
    });

    it('should throw an error when purchase price is less than or equal to 0', async () => {

        const productRepository = MockRepository();
        const useCase = new AddProductUsecase(productRepository);

        const input = {
            name: 'Product 1',
            description: 'Product 1 description',
            purchasePrice: 0,
            stock: 10,
        };

        await expect(useCase.execute(input)).rejects.toThrow(ValidationException);

        await expect(useCase.execute(input)).rejects.toMatchObject({
            errors: expect.arrayContaining([
                expect.objectContaining({
                    field: 'purchasePrice',
                    message: 'Purchase price must be greater than 0.',
                }),
            ]),
        });
    });

    it('should throw an error when stock is negative', async () => {

        const productRepository = MockRepository();
        const useCase = new AddProductUsecase(productRepository);

        const input = {
            name: 'Product 1',
            description: 'Product 1 description',
            purchasePrice: 80.00,
            stock: -1,
        };

        await expect(useCase.execute(input)).rejects.toThrow(ValidationException);

        await expect(useCase.execute(input)).rejects.toMatchObject({
            errors: expect.arrayContaining([
                expect.objectContaining({
                    field: 'stock',
                    message: 'Stock cannot be negative.',
                }),
            ]),
        });
    });

    it('should throw an error when repository throws conflict error on duplicate product', async () => {

        const input = {
            id: '138',
            name: 'New Product',
            description: 'New description',
            purchasePrice: 200,
            stock: 10,
        };

        const productRepository = MockRepository();
        productRepository.add.mockRejectedValue(
            new ConflictException(`Product with id ${input.id} already exists`)
        );

        const useCase = new AddProductUsecase(productRepository);
    
        await expect(useCase.execute(input)).rejects.toThrow(
          new ConflictException(`Product with id ${input.id} already exists`)
        );
    });    

    /*it('should throw an error when product with same ID already exists', async () => {

        const existingProduct = {
            id: '138',
            name: 'Existing Product',
            description: 'Already exists',
            purchasePrice: 100,
            stock: 5,
        };

        const productRepository = MockRepository();
        productRepository.existsById.mockResolvedValue(existingProduct);

        const useCase = new AddProductUsecase(productRepository);

        const input = {
            id: '138',
            name: 'New Product',
            description: 'New description',
            purchasePrice: 200,
            stock: 10,
        };

        await expect(useCase.execute(input)).rejects.toThrow(new ConflictException(`Product with id ${input.id} already exists`));
    });*/
});