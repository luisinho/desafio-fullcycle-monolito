import ProductAdmFacade from "../facade/product-adm.facade";
import ProductRepository from "../repository/product.repository";
import AddProductUsecase from "../usecase/add-product/add-product.usecase";
import CheckStockUseCase from "../usecase/check-stock/check-stock.usecase";

export default class ProductAdmFacadeFactory {

    static create(): ProductAdmFacade {
        const productRepository = new ProductRepository();
        const addProductUsecase = new AddProductUsecase(productRepository);
        const checkStockProductUseCase = new CheckStockUseCase(productRepository);

        const productFacade = new ProductAdmFacade({
          addUseCase: addProductUsecase,
          stockUseCase: checkStockProductUseCase,
        });

        return productFacade;
    }
}