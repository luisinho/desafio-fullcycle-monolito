import { Sequelize } from "sequelize-typescript";
import { ClientModel } from "../repository/client.model";
import ClientAdmFacadeFactory from "../factory/client-adm.facade.factory";
import { NotFoudException } from "@shared/domain/validation/not-found.exception";
import { ValidationException } from "@shared/domain/validation/validation.exception";

describe("ClientAdmFacade test", () => {

    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: { force: true },
        });

        await sequelize.addModels([ClientModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it('should create a client', async () => {

        const clientFacade = ClientAdmFacadeFactory.create();

        const input = {
            id: '1',
            name: 'Client 1',
            email: 'client@emil.com',
            documentType: 'CPF',
            document: '381.306.090-02',
            street: 'Paulista',
            number: '3',
            complement: 'casa',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '01103-100',
        };

        await clientFacade.add(input);

        const clientDb = await ClientModel.findOne({
            where: {
                id: input.id,
            }
        });

        expect(clientDb).toBeDefined();
        expect(clientDb.id).toEqual(input.id);
        expect(clientDb.name).toEqual(input.name);
        expect(clientDb.email).toEqual(input.email);
        expect(clientDb.documentType).toEqual(input.documentType);
        expect(clientDb.document).toEqual(input.document);
        expect(clientDb.street).toEqual(input.street);
        expect(clientDb.number).toEqual(input.number);
        expect(clientDb.complement).toEqual(input.complement);
        expect(clientDb.city).toEqual(input.city);
        expect(clientDb.state).toEqual(input.state);
        expect(clientDb.zipCode).toEqual(input.zipCode);
    });

    it('should throw an error when client name is empty', async () => {

        const clientFacade = ClientAdmFacadeFactory.create();

        const input = {
            id: '1',
            name: '',
            email: 'client@emil.com',
            documentType: 'CPF',
            document: '381.306.090-02',
            street: 'Paulista',
            number: '3',
            complement: 'casa',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '01103-100',
        };

        await expect(clientFacade.add(input)).rejects.toThrow(ValidationException);

        await expect(clientFacade.add(input)).rejects.toMatchObject({
            errors: expect.arrayContaining([
                expect.objectContaining({
                    field: 'name',
                    message: 'Name is required.',
                }),
            ]),
        });
    });

    it('should throw an error when client name is less than 3 characters', async () => {

        const clientFacade = ClientAdmFacadeFactory.create();

        const input = {
            id: '1',
            name: 'Ss',
            email: 'client@emil.com',
            documentType: 'CPF',
            document: '381.306.090-02',
            street: 'Paulista',
            number: '3',
            complement: 'casa',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '01103-100',
        };

        await expect(clientFacade.add(input)).rejects.toThrow(ValidationException);

        await expect(clientFacade.add(input)).rejects.toMatchObject({
            errors: expect.arrayContaining([
                expect.objectContaining({
                    field: 'name',
                    message: 'Name must be at least 3 characters long.',
                }),
            ]),
        });
    });

    it('should throw an error when client e-mail is empty', async () => {

        const clientFacade = ClientAdmFacadeFactory.create();

        const input = {
            id: '1',
            name: 'Sandra',
            email: '',
            documentType: 'CPF',
            document: '381.306.090-02',
            street: 'Paulista',
            number: '3',
            complement: 'casa',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '01103-100',
        };

        await expect(clientFacade.add(input)).rejects.toThrow(ValidationException);

        await expect(clientFacade.add(input)).rejects.toMatchObject({
            errors: expect.arrayContaining([
                expect.objectContaining({
                    field: 'email',
                    message: 'Email is required.',
                }),
            ]),
        });
    });

    it('should throw an error when client invalid e-mail', async () => {

        const clientFacade = ClientAdmFacadeFactory.create();

        const input = {
            id: '1',
            name: 'Sandra',
            email: 'clientemil.com',
            documentType: 'CPF',
            document: '381.306.090-02',
            street: 'Paulista',
            number: '3',
            complement: 'casa',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '01103-100',
        };

        await expect(clientFacade.add(input)).rejects.toThrow(ValidationException);

        await expect(clientFacade.add(input)).rejects.toMatchObject({
            errors: expect.arrayContaining([
                expect.objectContaining({
                    field: 'email',
                    message: 'Invalid email, please provide a valid email.',
                }),
            ]),
        });
    });

    it('should throw an error when client document type is empty', async () => {

        const clientFacade = ClientAdmFacadeFactory.create();

        const input = {
            id: '1',
            name: 'Sandra',
            email: 'client@emil.com',
            documentType: '',
            document: '381.306.090-02',
            street: 'Paulista',
            number: '3',
            complement: 'casa',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '01103-100',
        };

        await expect(clientFacade.add(input)).rejects.toThrow(ValidationException);

        await expect(clientFacade.add(input)).rejects.toMatchObject({
            errors: expect.arrayContaining([
                expect.objectContaining({
                    field: 'documentType',
                    message: 'Document Type is required.',
                }),
            ]),
        });
    });

    it('should throw an error when client document type is less than 3 characters', async () => {

        const clientFacade = ClientAdmFacadeFactory.create();

        const input = {
            id: '1',
            name: 'Sandra',
            email: 'client@emil.com',
            documentType: 'CP',
            document: '381.306.090-02',
            street: 'Paulista',
            number: '3',
            complement: 'casa',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '01103-100',
        };

        await expect(clientFacade.add(input)).rejects.toThrow(ValidationException);

        await expect(clientFacade.add(input)).rejects.toMatchObject({
            errors: expect.arrayContaining([
                expect.objectContaining({
                    field: 'documentType',
                    message: 'Document Type must be at least 3 characters long.',
                }),
            ]),
        });
    });

    it('should throw an error when client document is empty', async () => {

        const clientFacade = ClientAdmFacadeFactory.create();

        const input = {
            id: '1',
            name: 'Sandra',
            email: 'client@emil.com',
            documentType: 'CPF',
            document: '',
            street: 'Paulista',
            number: '3',
            complement: 'casa',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '01103-100',
        };

        await expect(clientFacade.add(input)).rejects.toThrow(ValidationException);

        await expect(clientFacade.add(input)).rejects.toMatchObject({
            errors: expect.arrayContaining([
                expect.objectContaining({
                    field: 'document',
                    message: 'Document is required.',
                }),
            ]),
        });
    });

    it('should throw an error when client invalid document', async () => {

        const clientFacade = ClientAdmFacadeFactory.create();

        const input = {
            id: '1',
            name: 'Sandra',
            email: 'client@emil.com',
            documentType: 'CPF',
            document: '381.306.090-0',
            street: 'Paulista',
            number: '3',
            complement: 'casa',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '01103-100',
        };

        await expect(clientFacade.add(input)).rejects.toThrow(ValidationException);

        await expect(clientFacade.add(input)).rejects.toMatchObject({
            errors: expect.arrayContaining([
                expect.objectContaining({
                    field: 'document',
                    message: 'Invalid document, CPF must contain exactly 11 digits.',
                }),
            ]),
        });
    });

    it('should throw an error when address has multiple invalid fields', async () => {

        const clientFacade = ClientAdmFacadeFactory.create();

        const input = {
            id: '1',
            name: 'Sandra',
            email: 'client@emil.com',
            documentType: 'CPF',
            document: '381.306.090-01',
            street: '',
            number: '',
            complement: '',
            city: '',
            state: '',
            zipCode: '',
        };

        await expect(clientFacade.add(input)).rejects.toThrow(ValidationException);

        await expect(clientFacade.add(input)).rejects.toMatchObject({
            errors: expect.arrayContaining([
                expect.objectContaining({ field: 'street', message: 'Street is required.' }),
                expect.objectContaining({ field: 'number', message: 'Number is required.' }),
                expect.objectContaining({ field: 'city', message: 'City is required.' }),
                expect.objectContaining({ field: 'state', message: 'State is required.' }),
                expect.objectContaining({ field: 'zipCode', message: 'Zip Code is required.' }),
            ]),
        });
    });

    it('should throw an error when creating a client with invalid zip code address', async () => {

        const clientFacade = ClientAdmFacadeFactory.create();

        const input = {
            id: '1',
            name: 'Sandra',
            email: 'client@emil.com',
            documentType: 'CPF',
            document: '381.306.090-01',
            street: 'Paulista',
            number: '3',
            complement: 'casa',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '0110-10',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        await expect(clientFacade.add(input)).rejects.toThrow(ValidationException);

        await expect(clientFacade.add(input)).rejects.toMatchObject({
            errors: expect.arrayContaining([
                expect.objectContaining({ field: 'zipCode', message: 'Invalid document, Zip Code must contain exactly 8 digits.' }),
            ]),
        });
    });

    it('should find a client by id', async () => {

        const facade = ClientAdmFacadeFactory.create();

        const client = await ClientModel.create({
            id: '1',
            name: 'Client 1',
            email: 'client@emil.com',
            documentType: 'CPF',
            document: '381.306.090-02',
            street: 'Paulista',
            number: '3',
            complement: 'casa',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '01103-100',
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const clientDb = await facade.findById({ id: client.id });

        expect(clientDb).toBeDefined();
        expect(clientDb.id).toEqual(client.id);
        expect(clientDb.name).toEqual(client.name);
        expect(clientDb.email).toEqual(client.email);
        expect(clientDb.documentType).toEqual(client.documentType);
        expect(clientDb.document).toEqual(client.document);
        expect(clientDb.street).toEqual(client.street);
        expect(clientDb.number).toEqual(client.number);
        expect(clientDb.complement).toEqual(client.complement);
        expect(clientDb.city).toEqual(client.city);
        expect(clientDb.state).toEqual(client.state);
        expect(clientDb.zipCode).toEqual(client.zipCode);
    });

    it('should throw an error when client by id not found', async () => {

        const clientFacade = ClientAdmFacadeFactory.create();

        await ClientModel.create({
            id: '1',
            name: 'Client 1',
            email: 'client@emil.com',
            documentType: 'CPF',
            document: '381.306.090-02',
            street: 'Paulista',
            number: '3',
            complement: 'casa',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '01103-100',
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const input = {
            id: '3',
        };

        await expect(clientFacade.findById(input)).rejects.toThrow(new NotFoudException(`Client with id ${input.id} not found.`));
    });

    it('should find a client by document', async () => {

        const facade = ClientAdmFacadeFactory.create();

        const client = await ClientModel.create({
            id: '1',
            name: 'Client 1',
            email: 'client@emil.com',
            documentType: 'CPF',
            document: '839.309.270-12',
            street: 'Paulista',
            number: '3',
            complement: 'casa',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '01103-100',
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const clientDb = await facade.findByDocument({ document: client.document });

        expect(clientDb).toBeDefined();
        expect(clientDb.id).toEqual(client.id);
        expect(clientDb.name).toEqual(client.name);
        expect(clientDb.email).toEqual(client.email);
        expect(clientDb.documentType).toEqual(client.documentType);
        expect(clientDb.document).toEqual(client.document);
        expect(clientDb.street).toEqual(client.street);
        expect(clientDb.number).toEqual(client.number);
        expect(clientDb.complement).toEqual(client.complement);
        expect(clientDb.city).toEqual(client.city);
        expect(clientDb.state).toEqual(client.state);
        expect(clientDb.zipCode).toEqual(client.zipCode);
    });

    it('should throw an error when client by document not found', async () => {

        const clientFacade = ClientAdmFacadeFactory.create();

        await ClientModel.create({
            id: '1',
            name: 'Client 1',
            email: 'client@emil.com',
            documentType: 'CPF',
            document: '158.645.860-48',
            street: 'Paulista',
            number: '3',
            complement: 'casa',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '01103-100',
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const input = {
            document: '377.448.910-66',
        };

        await expect(clientFacade.findByDocument(input)).rejects.toThrow(new NotFoudException(`Client with document ${input.document} not found.`));
    });
});