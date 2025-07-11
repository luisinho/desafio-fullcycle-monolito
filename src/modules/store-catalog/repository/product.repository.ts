import Product from "../domain/product.entity";
import ProductGateway from "../gateway/product.gateway";
import { StoreCatalogProductModel } from "./product.model";
import Id from "@shared/domain/value-object/id.value-object";

export default class ProductRepository implements ProductGateway {

   async find(id: string): Promise<Product> {
        const product = await StoreCatalogProductModel.findOne(({
            where: {
                id: id,
            }
        }));

        return new Product({
            id: new Id(product.id),
            name: product.name,
            description: product.description,
            salesPrice: product.salesPrice,
        });
    }

    async findAll(): Promise<Product[]> {

        const products = await StoreCatalogProductModel.findAll();

        return products.map((product) =>
            new Product({
                id: new Id(product.id),
                name: product.name,
                description: product.description,
                salesPrice: product.salesPrice,
            })
        );
    }
}

