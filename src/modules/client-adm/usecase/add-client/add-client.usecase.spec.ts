import AddClientUseCase from "./add-client.usecase";
import Address from "../../../@shared/domain/value-object/address";

const address: Address = new Address('Paulista', '3', 'São Paulo', 'SP', '0110-100', 'casa');

const MockRepository = () => {
    return {
        add: jest.fn(),
        find: jest.fn(),
    };
};

describe("Add Client use case unit test", () => {

    it('should add a client', async () => {

        const repository = MockRepository();
        const useCase = new AddClientUseCase(repository);

        const input = {
            name: 'Client 1',
            email: 'client@emil.com',
            documentType: 'CPF',
            document: '381.306.090-02',
            street: 'Paulista',
            number: '3',
            complement: 'casa',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '0110-100',
        };

        const result = await useCase.execute(input);

        expect(repository.add).toHaveBeenCalled();
        expect(result.id).toBeDefined();
        expect(result.name).toEqual(input.name);
        expect(result.email).toEqual(input.email);
        expect(result.document).toEqual(input.document);
        expect(result.street).toEqual(input.street);
        expect(result.number).toEqual(input.number);
        expect(result.complement).toEqual(input.complement);
        expect(result.city).toEqual(input.city);
        expect(result.state).toEqual(input.state);
        expect(result.zipCode).toEqual(input.zipCode);
    });
});