import express, { Request, Response, NextFunction } from "express";

import StoreCatalogFacadeFactory from "../modules/store-catalog/factory/facade.factory";

const storeCatalogRoutes = express.Router();

storeCatalogRoutes.get('/list', async (req: Request, resp: Response, next: NextFunction) => {

    try {

        const storeCatalogFacade = StoreCatalogFacadeFactory.create();

        const products = await storeCatalogFacade.findAll();

        resp.status(200).json(products);

    } catch (error: any) {

        next(error);
    }
});

storeCatalogRoutes.get('/:id', async (req: Request, resp: Response, next: NextFunction) => {

    try {
        
        const storeCatalogFacade = StoreCatalogFacadeFactory.create();

        const input = {
            id: req.params.id,
        };

        const client = await storeCatalogFacade.find(input);

        resp.status(200).json(client);

    } catch (error: any) {

        next(error);
      }
});

export default storeCatalogRoutes;