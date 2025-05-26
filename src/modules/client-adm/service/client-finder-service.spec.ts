import { Sequelize } from "sequelize-typescript";
import { ClientModel } from "../repository/client.model";
import ClientFinderService from "../service/client-finder.service";
import ClientAdmFacadeFactory from "../factory/client-adm.facade.factory";
import { NotFoudException } from "@shared/domain/validation/not-found.exception";

describe("ClientFinderService unit test", () => {

    let sequelize: Sequelize;
    let clientFinderService: ClientFinderService;

    beforeEach(async () => {
       sequelize = new Sequelize({
       dialect: 'sqlite',
       storage: ':memory:',
       logging: false,
       sync: { force: true },
      });

      await sequelize.addModels([ClientModel]);
      await sequelize.sync();
    
      const clientFacade = ClientAdmFacadeFactory.create();
      clientFinderService = new ClientFinderService(clientFacade);
    });

    afterEach(async () => {
    await sequelize.close();
  });

  it ('should find client by id or document', async () => {

    await ClientModel.create({
      id: '1',
      name: 'Sonia One',
      email: 'sonia1@email.com',
      documentType: 'CPF',
      document: '941.518.950-94',
      street: 'Paulista',
      number: '3',
      complement: 'Predio',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '10122-638',
      createdAt: new Date(),
      updatedAt: new Date(),
    });


    const clientById = await clientFinderService.find({ id: '1', document: '' });
    expect(clientById).toBeDefined();
    expect(clientById.id).toBe('1');

    const clientByDocument = await clientFinderService.find({ id: '', document: '941.518.950-94' });
    expect(clientByDocument).toBeDefined();
    expect(clientByDocument.document).toBe('941.518.950-94');
  });

  it ('should throw NotFoudException when client not found', async () => {

    await expect(clientFinderService.find({ id: '2', document: '' })).rejects.toThrow(new NotFoudException('Client with id 2 not found.'));

    await expect(clientFinderService.find({ id: '', document: '044.681.150-50' })).rejects.toThrow(new NotFoudException('Client with document 044.681.150-50 not found.'));
  });
});