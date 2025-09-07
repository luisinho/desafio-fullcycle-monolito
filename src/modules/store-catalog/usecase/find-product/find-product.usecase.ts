import ProductGateway from "../../gateway/product.gateway";
import { FindProductInputDto, FindProductOutputDto } from "./find-product.dto";
import { NotFoudException } from "@shared/domain/validation/not-found.exception";

export default class FindProductUseCase {

    constructor(private readonly productRepository: ProductGateway ){}

    async execute(input: FindProductInputDto): Promise<FindProductOutputDto> {

        const product = await this.productRepository.find(input.id);

        if (!product) {
            throw new NotFoudException(`Product with id ${input.id} not in the store catalog`);
        }        

        return {
            id: product.id.id,
            name: product.name,
            description: product.description,
            salesPrice: product.salesPrice,
        };
    }
}