import Client from "../../domain/client.entity";
import FindClientUseCase from "./find-client.usecase";
import Address from "../../../@shared/domain/value-object/address";
import Id from "../../../@shared/domain/value-object/id.value-object";

const address: Address = new Address('Paulista', '3', 'São Paulo', 'SP', '0110-100', 'casa');

const client = new Client({
    id: new Id('1'),
    name: 'Client 1',
    email: 'client@emil.com',
    documentType: 'CPF',
    document: '381.306.090-02',
    address,
});

const MockRepository = () => {
    return {
        add: jest.fn(),
        find: jest.fn().mockReturnValue(Promise.resolve(client)),
    };
};

describe("Find Client use case unit test", () => {

    it('should find a client', async () => {

        const repository = MockRepository();
        const useCase = new FindClientUseCase(repository);

        const input = {
            id: '1'
        };

        const result = await useCase.execute(input);

        expect(repository.find).toHaveBeenCalled();
        expect(result.id).toEqual(input.id);
        expect(result.name).toEqual(client.name);
        expect(result.email).toEqual(client.email);
        expect(result.document).toEqual(client.document);
        expect(result.street).toEqual(client.address.street);
        expect(result.number).toEqual(client.address.number);
        expect(result.complement).toEqual(client.address.complement);
        expect(result.city).toEqual(client.address.city);
        expect(result.state).toEqual(client.address.state);
        expect(result.zipCode).toEqual(client.address.zipCode);
        expect(result.createdAt).toEqual(client.createdAt);
        expect(result.updatedAt).toEqual(client.updatedAt);
    });
});
