import { Sequelize } from "sequelize-typescript";
import { ProductModel } from "../repository/product.model";
import ProductAdmFacadeFactory from "../factory/facade.factory";
import { ConflictException } from "@shared/domain/validation/conflict.exception";
import { NotFoudException } from '@shared/domain/validation/not-found.exception';
import { ValidationException } from "@shared/domain/validation/validation.exception";

describe("ProductAdmFacade test", () => {

    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: { force: true },
        });

        await sequelize.addModels([ProductModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it('should throw an error when trying to add a product with a duplicate ID', async () => {
        const productFacade = ProductAdmFacadeFactory.create();
    
        const input = {
            id: '1',
            name: 'Product 1',
            description: 'Product 1 description',
            purchasePrice: 100,
            stock: 10,
        };
    
        await productFacade.addProduct(input);
    
        await expect(productFacade.addProduct(input)).rejects.toThrow(ConflictException);
    
        await expect(productFacade.addProduct(input)).rejects.toMatchObject({
            message: `Product with id ${input.id} already exists`,
        });
    });

    it('should create a product', async () => {

        const productFacade = ProductAdmFacadeFactory.create();

        const input = {
            id: '1',
            name: 'Product 1',
            description: 'Prodict 1 description',
            purchasePrice: 100,
            stock: 10,
        };

        await productFacade.addProduct(input);
        

        const productDb = await ProductModel.findOne({
            where: { id: input.id },
        });

        expect(productDb).toBeDefined();
        expect(productDb.id).toBe(input.id);
        expect(productDb.name).toBe(input.name);
        expect(productDb.description).toBe(input.description);
        expect(productDb.purchasePrice).toBe(input.purchasePrice);
        expect(productDb.stock).toBe(input.stock);
    });

    it('should check product stock ', async () => {

        const productFacade = ProductAdmFacadeFactory.create();

        const input = {
            id: '1',
            name: 'Product 1',
            description: 'Prodict 1 description',
            purchasePrice: 100,
            stock: 10,
        };

        await productFacade.addProduct(input);

       const result = await productFacade.checkStock({ productId: input.id });

       expect(result).toBeDefined();
       expect(result.productId).toBe(input.id);
       expect(result.stock).toBe(input.stock);
    });

    it('should throw an error when check product in stock not found', async () => {

        const productFacade = ProductAdmFacadeFactory.create();

        const input = {
            id: '1',
            name: 'Product 1',
            description: 'Prodict 1 description',
            purchasePrice: 100,
            stock: 10,
        };

        const productId: string = '3';

        await productFacade.addProduct(input);

        await expect(productFacade.checkStock({ productId })).rejects.toThrow(new NotFoudException(`Product with id ${productId} not found`));
    });

    it('should throw an error when product name is empty', async () => {

        const productFacade = ProductAdmFacadeFactory.create();

        const input = {
            id: '1',
            name: '',
            description: 'Product 1 description',
            purchasePrice: 100,
            stock: 10,
        };

        await expect(productFacade.addProduct(input)).rejects.toThrow(ValidationException);

        await expect(productFacade.addProduct(input)).rejects.toMatchObject({
            errors: expect.arrayContaining([
                expect.objectContaining({
                    field: 'name',
                    message: 'Name is required.',
                }),
            ]),
        });
    });

    it('should throw an error when product name is less than 3 characters', async () => {

        const productFacade = ProductAdmFacadeFactory.create();

        const input = {
            id: '1',
            name: 'Ab',
            description: 'Product 1 description',
            purchasePrice: 100,
            stock: 10,
        };

        await expect(productFacade.addProduct(input)).rejects.toThrow(ValidationException);

        await expect(productFacade.addProduct(input)).rejects.toMatchObject({
            errors: expect.arrayContaining([
                expect.objectContaining({
                    field: 'name',
                    message: 'Name must be at least 3 characters long.',
                }),
            ]),
        });
    });

    it('should throw an error when product description is empty', async () => {

        const productFacade = ProductAdmFacadeFactory.create();

        const input = {
            id: '1',
            name: 'Product 1',
            description: '',
            purchasePrice: 100,
            stock: 10,
        };

        await expect(productFacade.addProduct(input)).rejects.toThrow(ValidationException);

        await expect(productFacade.addProduct(input)).rejects.toMatchObject({
            errors: expect.arrayContaining([
                expect.objectContaining({
                    field: 'description',
                    message: 'Description is required.',
                }),
            ]),
        });
    });

    it('should throw an error when product description is less than 5 characters', async () => {

        const productFacade = ProductAdmFacadeFactory.create();

        const input = {
            id: '1',
            name: 'Product 1',
            description: 'Prod',
            purchasePrice: 100,
            stock: 10,
        };

        await expect(productFacade.addProduct(input)).rejects.toThrow(ValidationException);

        await expect(productFacade.addProduct(input)).rejects.toMatchObject({
            errors: expect.arrayContaining([
                expect.objectContaining({
                    field: 'description',
                    message: 'Description must be at least 5 characters long.',
                }),
            ]),
        });
    });

    it('should throw an error when purchase price is less than or equal to 0', async () => {

        const productFacade = ProductAdmFacadeFactory.create();

        const input = {
            id: '1',
            name: 'Product 1',
            description: 'Product 1 description',
            purchasePrice: 0,
            stock: 10,
        };

        await expect(productFacade.addProduct(input)).rejects.toThrow(ValidationException);

        await expect(productFacade.addProduct(input)).rejects.toMatchObject({
            errors: expect.arrayContaining([
                expect.objectContaining({
                    field: 'purchasePrice',
                    message: 'Purchase price must be greater than 0.',
                }),
            ]),
        });
    });

    it('should throw an error when stock is negative', async () => {

        const productFacade = ProductAdmFacadeFactory.create();

        const input = {
            id: '1',
            name: 'Product 1',
            description: 'Product 1 description',
            purchasePrice: 80.00,
            stock: -1,
        };

        await expect(productFacade.addProduct(input)).rejects.toThrow(ValidationException);

        await expect(productFacade.addProduct(input)).rejects.toMatchObject({
            errors: expect.arrayContaining([
                expect.objectContaining({
                    field: 'stock',
                    message: 'Stock cannot be negative.',
                }),
            ]),
        });
    });
});