import { Sequelize } from "sequelize-typescript";
import { ClientModel } from "../repository/client.model";
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
            document: '381.306.090-02',
            street: 'Paulista',
            number: '3',
            complement: 'casa',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '0110-100',
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
        expect(clientDb.document).toEqual(input.document);
        expect(clientDb.street).toEqual(input.street);
        expect(clientDb.number).toEqual(input.number);
        expect(clientDb.complement).toEqual(input.complement);3
        expect(clientDb.city).toEqual(input.city);
        expect(clientDb.state).toEqual(input.state);
        expect(clientDb.zipCode).toEqual(input.zipCode);
    });

    it('should find a client', async () => {

        const facade = ClientAdmFacadeFactory.create();

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

        const clientDb = await facade.find({ id: client.id });

        expect(clientDb).toBeDefined();
        expect(clientDb.id).toEqual(client.id);
        expect(clientDb.name).toEqual(client.name);
        expect(clientDb.email).toEqual(client.email);
        expect(clientDb.document).toEqual(client.document);
        expect(clientDb.street).toEqual(client.street);
        expect(clientDb.number).toEqual(client.number);
        expect(clientDb.complement).toEqual(client.complement);
        expect(clientDb.city).toEqual(client.city);
        expect(clientDb.state).toEqual(client.state);
        expect(clientDb.zipCode).toEqual(client.zipCode);
    });
});