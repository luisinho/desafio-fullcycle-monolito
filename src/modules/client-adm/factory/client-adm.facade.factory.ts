import ClientAdmFacade from "../facade/client-adm.facade";
import ClientRepository from "../repository/client.repository";
import AddClientUseCase from "../usecase/add-client/add-client.usecase";
import FindClientByIdUseCase from "../usecase/find-client-by-id/find-client-by-id.usecase";
import FindClientByDocumentUseCase from "../usecase/find-client-by-document/find-client-by-document.usecase";
import ClientAdmFacadeInterface from "../facade/client-adm.facade.interface";

export default class ClientAdmFacadeFactory {

    static create(): ClientAdmFacadeInterface {
        const clientRepository = new ClientRepository();
        const addUseCase = new AddClientUseCase(clientRepository);
        const findByIdUseCase = new FindClientByIdUseCase(clientRepository);
        const findByDocumentUseCase = new FindClientByDocumentUseCase(clientRepository);

        const facade = new ClientAdmFacade({
            addUseCase: addUseCase,
            findByIdUseCase: findByIdUseCase,
            findByDocumentUseCase: findByDocumentUseCase,
        });

        return facade;
    }
}