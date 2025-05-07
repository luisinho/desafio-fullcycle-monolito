import { Sequelize } from "sequelize-typescript";

import { ClientModel } from "./client.model";
import Client from "../domain/client.entity";
import ClientRepository from "./client.repository";
import Id from "../../@shared/domain/value-object/id.value-object";

describe("ClientRepository test", () => {

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

        const client = new Client({
            id: new Id('1'),
            name: 'Client 1',
            email: 'client@emil.com',
            document: '381.306.090-02',
            street: 'Paulista',
            number: '3',
            complement: 'casa',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '0110-100',
        });

        const clientRepository = new ClientRepository();
        await clientRepository.add(client);

        const clientDb = await ClientModel.findOne({
            where: {
                id: client.id.id,
            }
        });

        expect(clientDb.id).toBeDefined();
        expect(clientDb.id).toEqual(client.id.id);
        expect(clientDb.name).toEqual(client.name);
        expect(clientDb.email).toEqual(client.email);
        expect(clientDb.document).toEqual(client.document);
        expect(clientDb.street).toEqual(client.street);
        expect(clientDb.number).toEqual(client.number);
        expect(clientDb.complement).toEqual(client.complement);
        expect(clientDb.city).toEqual(client.city);
        expect(clientDb.state).toEqual(client.state);
        expect(clientDb.zipCode).toEqual(client.zipCode);
        expect(clientDb.createdAt).toStrictEqual(client.createdAt);
        expect(clientDb.updatedAt).toStrictEqual(client.updatedAt);
    });

    it('should find a client', async () => {

        const client = await ClientModel.create({
            id: '1',
            name: 'Client 1',
            email: 'client@emil.com',
            document: '381.306.090-02',
            street: 'Paulista',
            number: '3',
            complement: 'casa',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '0110-100',
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const clientRepository = new ClientRepository();
        const result = await clientRepository.find(client.id);

        expect(result.id.id).toEqual(client.id);
        expect(result.name).toEqual(client.name);
        expect(result.email).toEqual(client.email);
        expect(result.document).toEqual(client.document);
        expect(result.street).toEqual(client.street);
        expect(result.number).toEqual(client.number);
        expect(result.complement).toEqual(client.complement);
        expect(result.city).toEqual(client.city);
        expect(result.state).toEqual(client.state);
        expect(result.zipCode).toEqual(client.zipCode);
        expect(result.createdAt).toStrictEqual(client.createdAt);
        expect(result.updatedAt).toStrictEqual(client.updatedAt);
    });
});