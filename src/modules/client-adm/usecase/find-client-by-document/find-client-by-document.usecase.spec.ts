import Client from "../../domain/client.entity";
import Address from "../../../@shared/domain/value-object/address";
import Id from "../../../@shared/domain/value-object/id.value-object";
import FindClientByDcumentUseCase from './find-client-by-document.usecase';
import { NotFoudException } from "@shared/domain/validation/not-found.exception";

const clientDocumentNotFound = '271.221.710-19';

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
        findById: jest.fn(),
        findByDocument: jest.fn().mockReturnValue(Promise.resolve(client)),
    };
};

describe("Find Client By Document use case unit test", () => {

    it('should find a client by document', async () => {

        const repository = MockRepository();
        const useCase = new FindClientByDcumentUseCase(repository);

        const input = {
            document: '381.306.090-02'
        };

        const result = await useCase.execute(input);

        expect(repository.findByDocument).toHaveBeenCalled();
        expect(result.document).toEqual(input.document);
        expect(result.id).toEqual(client.id.id);
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

    it('should throw error when client document not found', async () => {

        const clientRepository = {
            add: jest.fn(),
            existsByDocument: jest.fn(),
            findById: jest.fn(),
            findByDocument: jest.fn().mockImplementation(() => {
                throw new NotFoudException(`Client with document ${clientDocumentNotFound} not found.`);
            }),
        };

        const input = {
            document: clientDocumentNotFound,
        };

        const useCase = new FindClientByDcumentUseCase(clientRepository);

        await expect(useCase.execute(input))
            .rejects
            .toThrow(new NotFoudException(`Client with document ${clientDocumentNotFound} not found.`));
    });
});