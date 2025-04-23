import Product from "../domain/product";

export default interface ProductGateway {

    add(product: Product): Promise<void>;
    find(id: string): Promise<Product>;
}