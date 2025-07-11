import { Sequelize } from "sequelize-typescript";

import StoreCatalogFacadeFactory from "../factory/facade.factory";
import { StoreCatalogProductModel } from "../repository/product.model";

describe("StoreCatalogFacade (unit test)", () => {

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

    it('should find a product', async () => {

        const facade = StoreCatalogFacadeFactory.create();

        await StoreCatalogProductModel.create({
            id: '1',
            name: 'Product 1',
            description: 'description 1',
            salesPrice: 100,
        });

        const result = await facade.find({ id: '1' });

        expect(result.id).toBe('1');
        expect(result.name).toBe('Product 1');
        expect(result.description).toBe('description 1');
        expect(result.salesPrice).toBe(100);
    });

    it('should find all products', async () => {

        const facade = StoreCatalogFacadeFactory.create();

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

        const result = await facade.findAll();

        expect(result.products.length).toBe(2);
        expect(result.products[0].id).toBe('1');
        expect(result.products[0].name).toBe('Product 1');
        expect(result.products[0].description).toBe('description 1');
        expect(result.products[0].salesPrice).toBe(100);
        expect(result.products[1].id).toBe('2');
        expect(result.products[1].name).toBe('Product 2');
        expect(result.products[1].description).toBe('description 2');
        expect(result.products[1].salesPrice).toBe(150);
    });
});