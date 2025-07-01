import { UniqueConstraintError } from "sequelize";

import  Product from "../domain/product";
import { ProductModel } from "./product.model";
import ProductGateway from "../gateway/product.gateway";
import Id from "@shared/domain/value-object/id.value-object";
import { NotFoudException } from "@shared/domain/validation/not-found.exception";
import { ConflictException } from "@shared/domain/validation/conflict.exception";

export default class ProductRepository implements ProductGateway {

   async add(product: Product): Promise<void> {

    try {

        await ProductModel.create({
            id: product.id.id,
            name: product.name,
            description: product.description,
            purchasePrice: product.purchasePrice,
            salesPrice: product.salesPrice,
            stock: product.stock,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    } catch (err: any) {
        if (err instanceof UniqueConstraintError || err.name === 'SequelizeUniqueConstraintError') {
            throw new ConflictException(`Product with id ${product.id.id} already exists`);
        }
        throw err;
      }
    }

    async find(id: string): Promise<Product> {

      const product = await ProductModel.findOne({ where: { id: id}});

      if (!product) {
          throw new NotFoudException(`Product with id ${id} not found`);
      }

      return new Product({
            id: new Id(product.id),
            name: product.name,
            description: product.description,
            purchasePrice: product.purchasePrice,
            stock: product.stock,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
      });
    }

    async existsById(id: string): Promise<boolean> {

        const product = await ProductModel.findByPk(id);

        return product !== null;
    }
}