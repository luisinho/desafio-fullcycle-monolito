import { Sequelize } from "sequelize-typescript";

import  Product  from "../domain/product";
import { ProductModel } from "./product.model";
import  ProductRepository  from "./product.repository";
import Id from "@shared/domain/value-object/id.value-object";
import { NotFoudException } from "@shared/domain/validation/not-found.exception";
import { expectValidationError } from "../../../infrastructure/test/utils/expect-validation-error";

describe("ProductRepository (unit test)", () => {

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

    it('should create a product', async () => {

        const productProps = {
            id: new Id('1'),
            name: 'Product 1',
            description: 'Prodict 1 description',
            purchasePrice: 100,
            stock: 10,
        };
        
        const product = new Product(productProps);        

        const productRepository = new ProductRepository();
        await productRepository.add(product);

        const productDb = await ProductModel.findOne({
            where: { id: productProps.id.id },
        });

        expect(productDb).not.toBeNull();
        expect(productProps.id.id).toEqual(productDb.id);
        expect(productProps.name).toEqual(productDb.name);
        expect(productProps.description).toEqual(productDb.description);
        expect(productProps.purchasePrice).toEqual(productDb.purchasePrice);
        expect(productProps.stock).toEqual(productDb.stock);
    });

    it('should throw an error when product name is empty', async () => {

        const productProps = {
            name: '',
            description: 'Product 1 description',
            purchasePrice: 100,
            stock: 10,
        };

        expectValidationError(() => new Product(productProps), [
            { field: 'name', message: 'Name is required.' },
        ]);
    });

    it('should throw an error when product name is less than 3 characters', async () => {

        const productProps = {
            name: 'Ab',
            description: 'Product 1 description',
            purchasePrice: 100,
            stock: 10,
        };

        expectValidationError(() => new Product(productProps), [
            { field: 'name', message: 'Name must be at least 3 characters long.' },
        ]);
    });

    it('should throw an error when product description is empty', async () => {

        const productProps = {
            name: 'Product 1',
            description: '',
            purchasePrice: 100,
            stock: 10,
        };

        expectValidationError(() => new Product(productProps), [
            { field: 'description', message: 'Description is required.' },
        ]);
    });

    it('should throw an error when product description is less than 5 characters', async () => {

        const productProps = {
            name: 'Product 1',
            description: 'Prod',
            purchasePrice: 100,
            stock: 10,
        };

        expectValidationError(() => new Product(productProps), [
            { field: 'description', message: 'Description must be at least 5 characters long.' },
        ]);
    });

    it('should throw an error when purchase price is less than or equal to 0', async () => {

        const productProps = {
            name: 'Product 1',
            description: 'Product 1 description',
            purchasePrice: 0,
            stock: 10,
        };

        expectValidationError(() => new Product(productProps), [
            { field: 'purchasePrice', message: 'Purchase price must be greater than 0.' },
        ]);
    });

    it('should throw an error when stock is negative', async () => {

        const productProps = {
            name: 'Product 1',
            description: 'Product 1 description',
            purchasePrice: 80.00,
            stock: -1,
        };

        expectValidationError(() => new Product(productProps), [
            { field: 'stock', message: 'Stock cannot be negative.' },
        ]);
    });

    it('should find a product', async () => {

        const productRepository = new ProductRepository();

        await ProductModel.create({
          id: '1',
          name: 'Product 1',
          description: 'Prodict 1 description',
          purchasePrice: 100,
          salesPrice: 130,
          stock: 10,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        const productDb = await productRepository.find('1');

        expect(productDb).not.toBeNull();
        expect(productDb.id.id).toEqual('1');
        expect(productDb.name).toEqual('Product 1');
        expect(productDb.description).toEqual('Prodict 1 description');
        expect(productDb.purchasePrice).toEqual(100);
        expect(productDb.stock).toEqual(10);
    });

    it('should throw an error when product not found', async () => {

        const productRepository = new ProductRepository();

        await ProductModel.create({
          id: '1',
          name: 'Product 1',
          description: 'Prodict 1 description',
          purchasePrice: 100,
          salesPrice: 130,
          stock: 10,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        const id: string = '3';

        await expect(productRepository.find(id)).rejects.toThrow(new NotFoudException(`Product with id ${id} not found`));
    });
});