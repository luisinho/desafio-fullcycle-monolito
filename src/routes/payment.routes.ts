import express, { Request, Response, NextFunction } from "express";

import PaymentFacadeFactory from "../modules/payment/factory/payment.facade.factory";

const paymentRoutes = express.Router();

paymentRoutes.get('/:orderId', async (req: Request, resp: Response, next: NextFunction) => {

    try {

        const paymentFacade = PaymentFacadeFactory.create();

        const input = {
            orderId: req.params.orderId,
        };

        const transaction = await paymentFacade.findByOrderId(input);

        resp.status(200).json(transaction);

    } catch (error: any) {

        next(error);
    }
});

export default paymentRoutes;