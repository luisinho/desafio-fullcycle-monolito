import Client from "../../domain/client.entity";
import FindClientUseCase from "./find-client-by-id.usecase";
import Address from "@shared/domain/value-object/address";
import Id from "@shared/domain/value-object/id.value-object";
import { NotFoudException } from "@shared/domain/validation/not-found.exception";

const clientIdNotFound = '2';

const address: Address = new Address('Paulista', '3', 'São Paulo', 'SP', '01103-100', 'casa');

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
        existsByDocument: jest.fn(),
        findById: jest.fn().mockReturnValue(Promise.resolve(client)),
        findByDocument: jest.fn(),
    };
};

describe("FindClientByIdUseCase (unit test)", () => {

    it('should find a client by id', async () => {

        const repository = MockRepository();
        const useCase = new FindClientUseCase(repository);

        const input = {
            id: '1'
        };

        const result = await useCase.execute(input);

        expect(repository.findById).toHaveBeenCalled();
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

    it('should throw error when client by id not found', async () => {

        const clientRepository = {
            add: jest.fn(),
            existsByDocument: jest.fn(),
            findByDocument: jest.fn(),
            findById: jest.fn().mockImplementation(() => {
                throw new NotFoudException(`Client with id ${clientIdNotFound} not found`);
            }),
        };

        const input = {
            id: clientIdNotFound,
        };

        const useCase = new FindClientUseCase(clientRepository);

        await expect(useCase.execute(input))
            .rejects
            .toThrow(new NotFoudException(`Client with id ${clientIdNotFound} not found`));
    });
});