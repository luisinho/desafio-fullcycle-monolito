import ClientGateway from "../../gateway/client.gateway";
import { FindClientByIdInputDto, FindClientOutputDto } from "./find-client-by-id.usecase.dto";

export default class FindClientByIdUseCase {

    private _clientRepository: ClientGateway;

    constructor(clientRepository: ClientGateway){
        this._clientRepository = clientRepository;
    }

    async execute(input: FindClientByIdInputDto): Promise<FindClientOutputDto> {

       const client = await this._clientRepository.findById(input.id);

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