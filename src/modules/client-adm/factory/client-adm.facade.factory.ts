import ClientAdmFacade from "../facade/client-adm.facade";
import ClientRepository from "../repository/client.repository";
import AddClientUseCase from "../usecase/add-client/add-client.usecase";
import FindClientUseCase from "../usecase/find-client/find-client.usecase";

export default class ClientAdmFacadeFactory {

    static create(): ClientAdmFacade {
        const clientRepository = new ClientRepository();
        const addUseCase = new AddClientUseCase(clientRepository);
        const findUseCase = new FindClientUseCase(clientRepository);

        const facade = new ClientAdmFacade({
            addUseCase: addUseCase,
            findUseCase: findUseCase,
        });

        return facade;
    }
}