import Client from "../domain/client.entity";

export default interface ClientGateway {
    add(client: Client): Promise<void>;
    existsByDocument(document: string): Promise<boolean>;
    findById(id: string): Promise<Client>;
    findByDocument(document: string): Promise<Client>;
}