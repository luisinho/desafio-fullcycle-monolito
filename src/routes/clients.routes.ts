import express, { Request, Response, NextFunction} from "express";

import ClientAdmFacadeFactory from "../modules/client-adm/factory/client-adm.facade.factory";

const clientsRoutes = express.Router();

clientsRoutes.post('/', async (req: Request, resp: Response, next: NextFunction) => {

    try {

        const clientFacade = ClientAdmFacadeFactory.create();

        const { id, name, email, documentType, document, street, number, complement, city, state, zipCode } = req.body;

        const client = await clientFacade.add({
            id,
            name,
            email,
            documentType,
            document,
            street,
            number,
            complement,
            city,
            state,
            zipCode,
        });

        resp.status(201).json(client);

    } catch (error: any) {

        next(error);
    }
});

clientsRoutes.get('/:id', async (req: Request, resp: Response, next: NextFunction) => {

    try {

        const clientFacade = ClientAdmFacadeFactory.create();

        const input = {
            id: req.params.id,
        };

        const client = await clientFacade.findById(input);

        resp.status(200).json(client);

    } catch (error: any) {

        next(error);
      }
});

clientsRoutes.get('/document/:document', async (req: Request, resp: Response, next: NextFunction) => {

    try {

        const clientFacade = ClientAdmFacadeFactory.create();

        const input = {
            document: req.params.document,
        };

        const client = await clientFacade.findByDocument(input);

        resp.status(200).json(client);

    } catch (error: any) {

        next(error);
      }
});

export default clientsRoutes;