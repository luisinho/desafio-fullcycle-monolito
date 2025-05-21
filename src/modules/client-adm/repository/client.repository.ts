import { ClientModel } from "./client.model";
import Client from "../domain/client.entity";
import ClientGateway from "../gateway/client.gateway";
import Address from "../../@shared/domain/value-object/address";
import Id from "../../@shared/domain/value-object/id.value-object";
import { NotFoudException } from "@shared/domain/validation/not-found.exception";

export default class ClientRepository implements ClientGateway {

    async add(client: Client): Promise<void> {

        await ClientModel.create({
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
        });
    }

    async find(id: string): Promise<Client> {

        const client = await ClientModel.findOne({
            where: {
                id: id,
            }
        });

        if (!client) {
             throw new NotFoudException(`Client with id ${id} not found`);
        }

        return new Client({
           id: new Id(client.id),
           name: client.name,
           email: client.email,
           documentType: client.documentType,
           document: client.document,
           address: this.getAddress(client),
           createdAt: client.createdAt,
           updatedAt: client.updatedAt,
        });
    }

    async existsByDocument(document: string): Promise<boolean> {

        const client = await ClientModel.findOne({
            where: {
                document: document,
            }
        });

        return client !== null;
    }

    private getAddress(client: ClientModel): Address {

          return  new Address(
            client.street,
            client.number,
            client.city,
            client.state,
            client.zipCode,
            client.complement);
    }
}