import ClientGateway from "../../gateway/client.gateway";
import { FindClientByDocumentInputDto, FindClientByDocumentOutputDto } from "./find-client-by-document.usecase.dto";

export default class FindClientByDcumentUseCase {

    private _clientRepository: ClientGateway;

    constructor(clientRepository: ClientGateway) {
        this._clientRepository = clientRepository;
    }

    async execute(input: FindClientByDocumentInputDto): Promise<FindClientByDocumentOutputDto> {

        const client = await this._clientRepository.findByDocument(input.document);

        return {
            id: client.id.id,
            name: client.name,
            email: client.email,
            documentType: client.documentType,
            document: client.document,
            street: client.address.street,
            number: client.address.number,
            complement: client.address.complement,
            city: client.address.city,
            state: client.address.state,
            zipCode: client.address.zipCode,
            createdAt: client.createdAt,
            updatedAt: client.updatedAt,
        };
    }
}