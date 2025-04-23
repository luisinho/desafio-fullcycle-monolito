import { Sequelize } from "sequelize-typescript";

import { ClientModel } from "./client.model";
import ClientRepository from "./client.repository";
import Client from "../domain/client.entity";
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
            address: 'Address 1',
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
        expect(clientDb.address).toEqual(client.address);
        expect(clientDb.createdAt).toStrictEqual(client.createdAt);
        expect(clientDb.updatedAt).toStrictEqual(client.updatedAt);
    });

    it('should find a client', async () => {
        const client = await ClientModel.create({
            id: '1',
            name: 'Client 1',
            email: 'client@emil.com',
            address: 'Address 1',
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const clientRepository = new ClientRepository();
        const result = await clientRepository.find(client.id);

        expect(result.id.id).toEqual(client.id);
        expect(result.name).toEqual(client.name);
        expect(result.email).toEqual(client.email);
        expect(result.address).toEqual(client.address);
        expect(result.createdAt).toStrictEqual(client.createdAt);
        expect(result.updatedAt).toStrictEqual(client.updatedAt);
    });
});
