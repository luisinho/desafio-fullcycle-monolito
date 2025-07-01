import express, { Request, Response, NextFunction } from "express";

import CheckoutFacadeFactory from "../modules/checkout/factory/place-order.facade.factory";

const checkoutRoutes = express.Router();

const checkoutFacade = CheckoutFacadeFactory.create();

checkoutRoutes.post('/checkout', async (req: Request, resp: Response, next: NextFunction) => {

    try {

        const { clientId, document, products } = req.body;

        const order = await checkoutFacade.addOrder({
            clientId,
            document,
            products,
        });

        resp.status(201).json(order);

    } catch (error: any) {
        // console.error('Error placing order: ', error);
        next(error);
    }
});

checkoutRoutes.get('/checkout/document/client/:document', async (req: Request, resp: Response, next: NextFunction) => {

    try {

        const input = {
            document: req.params.document,
        };

        const orders = await checkoutFacade.findPlaceOrderByDocument(input);

        resp.status(200).json(orders);

    } catch (error: any) {
        // console.error('Error finding orders by document: ', error);
        next(error);
    }
});

export default checkoutRoutes;