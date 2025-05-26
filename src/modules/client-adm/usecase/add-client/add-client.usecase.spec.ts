import AddClientUseCase from "./add-client.usecase";
import { ConflictException } from "@shared/domain/validation/conflict.exception";
import { ValidationException } from "@shared/domain/validation/validation.exception";

const MockRepository = () => {
    return {
        add: jest.fn(),
        existsByDocument: jest.fn(),
        findById: jest.fn(),
        findByDocument: jest.fn(),
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
            zipCode: '01103-100',
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

    it('should throw an error when client name is empty', async () => {

        const repository = MockRepository();
        const useCase = new AddClientUseCase(repository);

        const input = {
            name: '',
            email: 'client@emil.com',
            documentType: 'CPF',
            document: '381.306.090-02',
            street: 'Paulista',
            number: '3',
            complement: 'casa',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '01103-100',
        };

        await expect(useCase.execute(input)).rejects.toThrow(ValidationException);

        await expect(useCase.execute(input)).rejects.toMatchObject({
            errors: expect.arrayContaining([
                expect.objectContaining({
                    field: 'name',
                    message: 'Name is required.',
                }),
            ]),
        });
    });

    it('should throw an error when client name is less than 3 characters', async () => {

        const repository = MockRepository();
        const useCase = new AddClientUseCase(repository);

        const input = {
            name: 'Ss',
            email: 'client@emil.com',
            documentType: 'CPF',
            document: '381.306.090-02',
            street: 'Paulista',
            number: '3',
            complement: 'casa',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '01103-100',
        };

        await expect(useCase.execute(input)).rejects.toThrow(ValidationException);

        await expect(useCase.execute(input)).rejects.toMatchObject({
            errors: expect.arrayContaining([
                expect.objectContaining({
                    field: 'name',
                    message: 'Name must be at least 3 characters long.',
                }),
            ]),
        });
    });

    it('should throw an error when client e-mail is empty', async () => {

        const repository = MockRepository();
        const useCase = new AddClientUseCase(repository);

        const input = {
            name: 'Sandra',
            email: '',
            documentType: 'CPF',
            document: '381.306.090-02',
            street: 'Paulista',
            number: '3',
            complement: 'casa',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '01103-100',
        };

        await expect(useCase.execute(input)).rejects.toThrow(ValidationException);

        await expect(useCase.execute(input)).rejects.toMatchObject({
            errors: expect.arrayContaining([
                expect.objectContaining({
                    field: 'email',
                    message: 'Email is required.',
                }),
            ]),
        });
    });

    it('should throw an error when client invalid e-mail', async () => {

        const repository = MockRepository();
        const useCase = new AddClientUseCase(repository);

        const input = {
            name: 'Sandra',
            email: 'clientemil.com',
            documentType: 'CPF',
            document: '381.306.090-02',
            street: 'Paulista',
            number: '3',
            complement: 'casa',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '01103-100',
        };

        await expect(useCase.execute(input)).rejects.toThrow(ValidationException);

        await expect(useCase.execute(input)).rejects.toMatchObject({
            errors: expect.arrayContaining([
                expect.objectContaining({
                    field: 'email',
                    message: 'Invalid email, please provide a valid email.',
                }),
            ]),
        });
    });

    it('should throw an error when client document type is empty', async () => {

        const repository = MockRepository();
        const useCase = new AddClientUseCase(repository);

        const input = {
            name: 'Sandra',
            email: 'clientemil.com',
            documentType: '',
            document: '381.306.090-02',
            street: 'Paulista',
            number: '3',
            complement: 'casa',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '01103-100',
        };

        await expect(useCase.execute(input)).rejects.toThrow(ValidationException);

        await expect(useCase.execute(input)).rejects.toMatchObject({
            errors: expect.arrayContaining([
                expect.objectContaining({
                    field: 'documentType',
                    message: 'Document Type is required.',
                }),
            ]),
        });
    });

    it('should throw an error when client document type is less than 3 characters', async () => {

        const repository = MockRepository();
        const useCase = new AddClientUseCase(repository);

        const input = {
            name: 'Sandra',
            email: 'clientemil.com',
            documentType: 'CP',
            document: '381.306.090-02',
            street: 'Paulista',
            number: '3',
            complement: 'casa',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '01103-100',
        };

        await expect(useCase.execute(input)).rejects.toThrow(ValidationException);

        await expect(useCase.execute(input)).rejects.toMatchObject({
            errors: expect.arrayContaining([
                expect.objectContaining({
                    field: 'documentType',
                    message: 'Document Type must be at least 3 characters long.',
                }),
            ]),
        });
    });

    it('should throw an error when client document is empty', async () => {

        const repository = MockRepository();
        const useCase = new AddClientUseCase(repository);

        const input = {
            name: 'Sandra',
            email: 'clientemil.com',
            documentType: 'CPF',
            document: '',
            street: 'Paulista',
            number: '3',
            complement: 'casa',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '01103-100',
        };

        await expect(useCase.execute(input)).rejects.toThrow(ValidationException);

        await expect(useCase.execute(input)).rejects.toMatchObject({
            errors: expect.arrayContaining([
                expect.objectContaining({
                    field: 'document',
                    message: 'Document is required.',
                }),
            ]),
        });
    });

    it('should throw an error when client invalid document', async () => {

        const repository = MockRepository();
        const useCase = new AddClientUseCase(repository);

        const input = {
            name: 'Sandra',
            email: 'clientemil.com',
            documentType: 'CPF',
            document: '381.306.090-0',
            street: 'Paulista',
            number: '3',
            complement: 'casa',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '01103-100',
        };

        await expect(useCase.execute(input)).rejects.toThrow(ValidationException);

        await expect(useCase.execute(input)).rejects.toMatchObject({
            errors: expect.arrayContaining([
                expect.objectContaining({
                    field: 'document',
                    message: 'Invalid document, CPF must contain exactly 11 digits.',
                }),
            ]),
        });
    });

    it('should throw an error when address has multiple invalid fields', async () => {

        const repository = MockRepository();
        const useCase = new AddClientUseCase(repository);

        const input = {
            name: 'Sandra',
            email: 'clientemil.com',
            documentType: 'CPF',
            document: '381.306.090-01',
            street: '',
            number: '',
            complement: '',
            city: '',
            state: '',
            zipCode: '',
        };

        await expect(useCase.execute(input)).rejects.toThrow(ValidationException);

        await expect(useCase.execute(input)).rejects.toMatchObject({
            errors: expect.arrayContaining([
                expect.objectContaining({ field: 'street', message: 'Street is required.' }),
                expect.objectContaining({ field: 'number', message: 'Number is required.' }),
                expect.objectContaining({ field: 'city', message: 'City is required.' }),
                expect.objectContaining({ field: 'state', message: 'State is required.' }),
                expect.objectContaining({ field: 'zipCode', message: 'Zip Code is required.' }),
            ]),
        });
    });

    it('should throw an error when creating a client with invalid zip code address', async () => {

        const repository = MockRepository();
        const useCase = new AddClientUseCase(repository);

        const input = {
            name: 'Sandra',
            email: 'clientemil.com',
            documentType: 'CPF',
            document: '381.306.090-01',
            street: 'Paulista',
            number: '3',
            complement: 'casa',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '0110-10',
        };

        await expect(useCase.execute(input)).rejects.toThrow(ValidationException);

        await expect(useCase.execute(input)).rejects.toMatchObject({
            errors: expect.arrayContaining([
                expect.objectContaining({ field: 'zipCode', message: 'Invalid document, Zip Code must contain exactly 8 digits.' }),
            ]),
        });
    });

    it('should throw an error when client with same CPF already exists', async () => {

        const existingClient = {
            name: 'Client 1',
            email: 'client@emil.com',
            documentType: 'CPF',
            document: '503.031.780-51',
            street: 'Paulista',
            number: '3',
            complement: 'casa',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '01103-100',
        };            

        const clientRepository = MockRepository();
        clientRepository.existsByDocument.mockResolvedValue(existingClient);

        const useCase = new AddClientUseCase(clientRepository);

        const input = {
            name: 'Client 1',
            email: 'client@emil.com',
            documentType: 'CPF',
            document: '503.031.780-51',
            street: 'Paulista',
            number: '3',
            complement: 'casa',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '01103-100',
        };

        await expect(useCase.execute(input)).rejects.toThrow(ConflictException);
        await expect(useCase.execute(input)).rejects.toThrow("Client with document 503.031.780-51 already exists");
    });
});