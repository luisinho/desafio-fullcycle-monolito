import { Sequelize } from "sequelize-typescript";

import ProductRepository from "./product.repository";
import { StoreCatalogProductModel } from "./product.model";

describe("ProductRepository (unit test)", () => {

    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: { force: true },
        });

        await sequelize.addModels([StoreCatalogProductModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it('should find all products', async () => {

        await StoreCatalogProductModel.create({
            id: '1',
            name: 'Product 1',
            description: 'description 1',
            salesPrice: 100,
        });          

        await StoreCatalogProductModel.create({
            id: '2',
            name: 'Product 2',
            description: 'description 2',
            salesPrice: 150,
        });

        const productRepository = new ProductRepository();
        const products = await productRepository.findAll();

        expect(products.length).toBe(2);
        expect(products[0].id.id).toBe('1');
        expect(products[0].name).toBe('Product 1');
        expect(products[0].description).toBe('description 1');
        expect(products[0].salesPrice).toBe(100);
        expect(products[1].id.id).toBe('2');
        expect(products[1].name).toBe('Product 2');
        expect(products[1].description).toBe('description 2');
        expect(products[1].salesPrice).toBe(150);
    });

    it('should find a product', async () => {

        await StoreCatalogProductModel.create({
            id: '1',
            name: 'Product 1',
            description: 'description 1',
            salesPrice: 150,
        });

        const productRepository = new ProductRepository();
        const product = await productRepository.find('1');

        expect(product.id.id).toBe('1');
        expect(product.name).toBe('Product 1');
        expect(product.description).toBe('description 1');
        expect(product.salesPrice).toBe(150);
    });
});