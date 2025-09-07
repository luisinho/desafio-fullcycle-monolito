import express, { Request, Response, NextFunction } from "express";

import CheckoutFacadeFactory from "../modules/checkout/factory/place-order.facade.factory";

const checkoutRoutes = express.Router();

checkoutRoutes.post('/', async (req: Request, resp: Response, next: NextFunction) => {

    try {

        const checkoutFacade = CheckoutFacadeFactory.create();

        const { clientId, document, products } = req.body;

        const order = await checkoutFacade.addOrder({
            clientId,
            document,
            products,
        });

        resp.status(201).json(order);

    } catch (error: any) {

        next(error);
    }
});

checkoutRoutes.get('/:id', async (req: Request, resp: Response, next: NextFunction) => {

    try {

        const checkoutFacade = CheckoutFacadeFactory.create();

        const input = {
            id: req.params.id,
        };

        const orders = await checkoutFacade.findOrderById(input);

        resp.status(200).json(orders);

    } catch (error: any) {

        next(error);
    }
});

checkoutRoutes.get('/document/client/:document', async (req: Request, resp: Response, next: NextFunction) => {

    try {

        const checkoutFacade = CheckoutFacadeFactory.create();

        const input = {
            document: req.params.document,
        };

        const orders = await checkoutFacade.findPlaceOrderByDocument(input);

        resp.status(200).json(orders);

    } catch (error: any) {

        next(error);
    }
});

export default checkoutRoutes;