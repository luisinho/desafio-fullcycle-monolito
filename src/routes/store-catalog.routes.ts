import express, { Request, Response, NextFunction } from "express";

import StoreCatalogFacadeFactory from "../modules/store-catalog/factory/facade.factory";

const storeCatalogRoutes = express.Router();

const storeCatalogFacade = StoreCatalogFacadeFactory.create();

storeCatalogRoutes.get('/catalogs', async (req: Request, resp: Response, next: NextFunction) => {

    try {

        const products = await storeCatalogFacade.findAll();

        resp.status(200).json(products);

    } catch (error: any) {
        // console.error('Error fetching all products: ', error);
        next(error);
    }
    
});

export default storeCatalogRoutes;