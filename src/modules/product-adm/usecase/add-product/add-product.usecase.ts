import  Product from "../../domain/product";
import ProductGateway from "../../gateway/product.gateway";
import Id from "../../../@shared/domain/value-object/id.value-object";
import { AddProductInputDto, AddProductOutputDto } from "./add-product.dto";
import { ConflictException } from "@shared/domain/validation/conflict.exception";

export default class AddProductUsecase {

    private _productRepository: ProductGateway;

    constructor(_productRepository: ProductGateway) {
        this._productRepository = _productRepository;
    }

    async execute(input: AddProductInputDto): Promise<AddProductOutputDto> {

        const existing = await this._productRepository.existsById(input.id);

        if (existing) {
            throw new ConflictException(`Product with id ${input.id} already exists`);
        }

        const props = {
            id: new Id(input.id),
            name: input.name,
            description: input.description,
            purchasePrice: input.purchasePrice,
            stock: input.stock,
        };

        const product = new Product(props);
        await this._productRepository.add(product);

        return {
            id: product.id.id,
            name: product.name,
            description: product.description,
            purchasePrice: product.purchasePrice,
            stock: product.stock,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,            
        };
    }
}