import express, { Request, Response, NextFunction } from "express";

import InvoiceFacadeFactory from "../modules/invoice/factory/invoice-facade.factory";

const invoiceRoutes = express.Router();

invoiceRoutes.post('/', async (req: Request, resp: Response, next: NextFunction) => {

    try {

        const invoiceFacade = InvoiceFacadeFactory.create();

        const {  name, document, street,
                 number, complement, city,
                 state, zipCode, items } = req.body;

        const invoice = await invoiceFacade
           .generate({ name, document, street,
                       number, complement, city,
                       state, zipCode, items });

        resp.status(201).json(invoice);

    } catch (error: any) {

        next(error);
    }
});

invoiceRoutes.get('/:id', async (req: Request, resp: Response, next: NextFunction) => {

    try {

        const invoiceFacade = InvoiceFacadeFactory.create();

        const input = {
            id: req.params.id,
        };

        const invoice = await invoiceFacade.find(input);

        resp.status(200).json(invoice);

    } catch (error: any) {

        next(error);
    }
});

invoiceRoutes.get('/list/:ids', async (req: Request, resp: Response, next: NextFunction) => {

    try {

        const invoiceFacade = InvoiceFacadeFactory.create();        

        const input = { ids: req.params.ids.split(",") };

        const invoice = await invoiceFacade.listByIds(input);

        resp.status(200).json(invoice);

    } catch (error: any) {

        next(error);
    }
});

export default invoiceRoutes;