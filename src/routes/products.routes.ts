import express, { Request, Response, NextFunction } from "express";

import ProductAdmFacadeFactory from "../modules/product-adm/factory/facade.factory";

const productRoutes = express.Router();

const productFacade = ProductAdmFacadeFactory.create();

productRoutes.post('/', async (req: Request, resp: Response, next: NextFunction) => {

    try {

        const { name, description, purchasePrice, stock } = req.body;

        const product = await productFacade.addProduct({
            id: '',
            name,
            description,
            purchasePrice,
            stock,
        });

        resp.status(201).json(product);

    } catch (error: any) {
        // console.error('Erro ao adicionar produto:', error);
        next(error);
      }
});

export default productRoutes;