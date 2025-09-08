import ProductGateway from "../../gateway/product.gateway";
import { FindAllProductsDto } from "./find-all-products.dto";
import UseCaseInterface from "@shared/usecase/use-case.interface";
import { NotFoudException } from "@shared/domain/validation/not-found.exception";

export default class FindAllProductsUseCase implements UseCaseInterface {

    constructor(private productRepository: ProductGateway) {}

    async execute(): Promise<FindAllProductsDto[]> {

        const products = await this.productRepository.findAll();

        if (products.length === 0) {
            throw new NotFoudException('Products not found in the store catalog.');
        }

        return  products.map(product => ({
                id: product.id.id,
                name: product.name,
                description: product.description,
                salesPrice: product.salesPrice,
            }));
        
    }
}