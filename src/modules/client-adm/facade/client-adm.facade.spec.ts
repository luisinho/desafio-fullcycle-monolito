import { Sequelize } from "sequelize-typescript";
import { ClientModel } from "../repository/client.model";
import ClientRepository from "../repository/client.repository";
import AddClientUseCase from "../usecase/add-client/add-client.usecase";
import ClientAdmFacade from "./client-adm.facade";
import FindClientUseCase from "../usecase/find-client/find-client.usecase";
import ClientAdmFacadeFactory from "../factory/client-adm.facade.factory";

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

        const facade = ClientAdmFacadeFactory.create();

        const input = {
            id: '1',
            name: 'Client 1',
            email: 'client@emil.com',
            address: 'Address 1',
        };

        await facade.add(input);

        const clientDb = await ClientModel.findOne({
            where: {
                id: input.id,
            }
        });

        expect(clientDb).toBeDefined();
        expect(clientDb.id).toEqual(input.id);
        expect(clientDb.name).toEqual(input.name);
        expect(clientDb.email).toEqual(input.email);
        expect(clientDb.address).toEqual(input.address);
    });

    it('should find a client', async () => {

        const facade = ClientAdmFacadeFactory.create();

        const client = await ClientModel.create({
            id: '1',
            name: 'Client 1',
            email: 'client@emil.com',
            address: 'Address 1',
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const clientDb = await facade.find({ id: client.id });

        expect(clientDb).toBeDefined();
        expect(clientDb.id).toEqual(client.id);
        expect(clientDb.name).toEqual(client.name);
        expect(clientDb.email).toEqual(client.email);
        expect(clientDb.address).toEqual(client.address);
    });
});