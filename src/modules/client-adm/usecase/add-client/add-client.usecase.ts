import Client from "../../domain/client.entity";
import ClientGateway from "../../gateway/client.gateway";
import Address from "../../../@shared/domain/value-object/address";
import Id from "../../../@shared/domain/value-object/id.value-object";
import { AddClientInputDto, AddClientOutputDto } from "./add-client.usecase.dto";
import { ConflictException } from "@shared/domain/validation/conflict.exception";

export default class AddClientUseCase {

    private _clientRepository: ClientGateway;

    constructor(clientRepository: ClientGateway){
        this._clientRepository = clientRepository;
    }

    async execute(input: AddClientInputDto): Promise<AddClientOutputDto> {

        const existing = await this._clientRepository.existsByDocument(input.document);

        if (existing) {
            throw new ConflictException(`Client with document ${input.document} already exists`);
        }

        const address: Address = new Address(input.street, input.number, input.city, input.state, input.zipCode, input.complement);

        const props = {
            id: new Id(input.id) || new Id(),
            name: input.name,
            email: input.email,
            documentType: input.documentType,
            document: input.document,
            address,
        };

        const client = new Client(props);

        await this._clientRepository.add(client);

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