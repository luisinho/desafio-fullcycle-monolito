import StoreCatalogFacade from "../facade/store-catalog.facade";
import ProductRepository from "../repository/product.repository";
import FindProductUseCase from "../usecase/find-product/find-product.usecase";
import StoreCatalogFacadeInterface from "../facade/store-catalog.facade.interface";
import FindAllProductsUseCase from "../usecase/find-all-products/find-all-products.usecase";

export default class StoreCatalogFacadeFactory {

    static create(): StoreCatalogFacadeInterface {

        const productRepository = new ProductRepository();
        const findUseCase = new FindProductUseCase(productRepository);
        const findAllUseCase = new FindAllProductsUseCase(productRepository);

        const facade = new StoreCatalogFacade({
            findUseCase: findUseCase,
            findAllUseCase: findAllUseCase,
        });

        return facade;
    }
}