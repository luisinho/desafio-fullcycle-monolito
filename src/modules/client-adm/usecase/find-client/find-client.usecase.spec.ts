import Client from "../../domain/client.entity";
import FindClientUseCase from "./find-client.usecase";
import Id from "../../../@shared/domain/value-object/id.value-object";

const client = new Client({
    id: new Id('1'),
    name: 'Client 1',
    email: 'client@emil.com',
    document: '381.306.090-02',
    street: 'Paulista',
    number: '3',
    complement: 'casa',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '0110-100',
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
        expect(result.street).toEqual(client.street);
        expect(result.number).toEqual(client.number);
        expect(result.complement).toEqual(client.complement);
        expect(result.city).toEqual(client.city);
        expect(result.state).toEqual(client.state);
        expect(result.zipCode).toEqual(client.zipCode);
        expect(result.createdAt).toEqual(client.createdAt);
        expect(result.updatedAt).toEqual(client.updatedAt);
    });
});
