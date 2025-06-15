import express, { Request, Response, NextFunction } from "express";

import ProductAdmFacadeFactory from "../modules/product-adm/factory/facade.factory";

const productRoutes = express.Router();

const productFacade = ProductAdmFacadeFactory.create();

productRoutes.post('/products', async (req: Request, resp: Response, next: NextFunction) => {

    try {

        const { id, name, description, purchasePrice, stock } = req.body;

        const product = await productFacade.addProduct({
            id,
            name,
            description,
            purchasePrice,
            stock,
        });

        resp.status(201).json(product);

    } catch (error: any) {
        // console.error('Error adding product: ', error);
        next(error);
      }
});

productRoutes.get('/products/check-stock/:id', async (req: Request, resp: Response, next: NextFunction) => {

    try {        

        const input = {
            productId: req.params.id,
        };

        const product = await productFacade.checkStock(input);

        resp.status(200).json(product);

    } catch (error: any) {
        // console.error('Error checking stock: ', error);
        next(error);
      }
});

export default productRoutes;