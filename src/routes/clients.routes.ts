import express, { Request, Response, NextFunction} from "express";

import ClientAdmFacadeFactory from "../modules/client-adm/factory/client-adm.facade.factory";

const clientsRoutes = express.Router();

const clientFacade = ClientAdmFacadeFactory.create();

clientsRoutes.post('/clients', async (req: Request, resp: Response, next: NextFunction) => {

    try {

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
        // console.error('Error adding client: ', error);
        next(error);
    }
});

clientsRoutes.get('/clients/:id', async (req: Request, resp: Response, next: NextFunction) => {

    try {        

        const input = {
            id: req.params.id,
        };

        const client = await clientFacade.findById(input);

        resp.status(200).json(client);

    } catch (error: any) {
        // console.error('Error find id client: ', error);
        next(error);
      }
});

clientsRoutes.get('/clients/document/:document', async (req: Request, resp: Response, next: NextFunction) => {

    try {        

        const input = {
            document: req.params.document,
        };

        const client = await clientFacade.findByDocument(input);

        resp.status(200).json(client);

    } catch (error: any) {
        // console.error('Error find by document client: ', error);
        next(error);
      }
});

export default clientsRoutes;