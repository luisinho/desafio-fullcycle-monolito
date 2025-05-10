import { Sequelize } from "sequelize-typescript";

import { ClientModel } from "./client.model";
import Client from "../domain/client.entity";
import ClientRepository from "./client.repository";
import Address from "../../@shared/domain/value-object/address";
import Id from "../../@shared/domain/value-object/id.value-object";
import { ValidationException } from "../../@shared/domain/validation/validation.exception";
import { expectValidationError } from '../../../infrastructure/test/utils/expect-validation-error';

const address: Address = new Address('Paulista', '3', 'São Paulo', 'SP', '0110-100', 'casa');

describe("ClientRepository unit test", () => {

    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: { force: true },
        });

        await sequelize.addModels([ClientModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it('should create a client', async () => {

        const client = new Client({
            id: new Id('1'),
            name: 'Sandra',
            email: 'client@emil.com',
            documentType: 'CPF',
            document: '381.306.090-02',
            address,
        });

        const clientRepository = new ClientRepository();
        await clientRepository.add(client);

        const clientDb = await ClientModel.findOne({
            where: {
                id: client.id.id,
            }
        });

        expect(clientDb.id).toBeDefined();
        expect(clientDb.id).toEqual(client.id.id);
        expect(clientDb.name).toEqual(client.name);
        expect(clientDb.email).toEqual(client.email);
        expect(clientDb.document).toEqual(client.document);
        expect(clientDb.street).toEqual(client.address.street);
        expect(clientDb.number).toEqual(client.address.number);
        expect(clientDb.complement).toEqual(client.address.complement);
        expect(clientDb.city).toEqual(client.address.city);
        expect(clientDb.state).toEqual(client.address.state);
        expect(clientDb.zipCode).toEqual(client.address.zipCode);
        expect(clientDb.createdAt).toStrictEqual(client.createdAt);
        expect(clientDb.updatedAt).toStrictEqual(client.updatedAt);
    });

    it('should find a client', async () => {

        const client = await ClientModel.create({
            id: '1',
            name: 'Sandra',
            email: 'client@emil.com',
            document: '381.306.090-02',
            street: 'Paulista',
            number: '3',
            complement: 'casa',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '0110-100',
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const clientRepository = new ClientRepository();
        const result = await clientRepository.find(client.id);

        expect(result.id.id).toEqual(client.id);
        expect(result.name).toEqual(client.name);
        expect(result.email).toEqual(client.email);
        expect(result.document).toEqual(client.document);
        expect(result.address.street).toEqual(client.street);
        expect(result.address.number).toEqual(client.number);
        expect(result.address.complement).toEqual(client.complement);
        expect(result.address.city).toEqual(client.city);
        expect(result.address.state).toEqual(client.state);
        expect(result.address.zipCode).toEqual(client.zipCode);
        expect(result.createdAt).toStrictEqual(client.createdAt);
        expect(result.updatedAt).toStrictEqual(client.updatedAt);
    });

    it('should throw an error when client name is empty', async () => {

        const clientProps = {
            id: new Id('1'),
            name: '',
            email: 'client@emil.com',
            documentType: 'CPF',
            document: '381.306.090-02',
            address,
        };

        expectValidationError(() => new Client(clientProps), [
            { field: 'name', message: 'Name is required.' },
        ]);
    });

    it('should throw an error when client name is less than 3 characters', async () => {

        const clientProps = {
            id: new Id('1'),
            name: 'Ss',
            email: 'client@emil.com',
            documentType: 'CPF',
            document: '381.306.090-02',
            address,
        };

        expectValidationError(() => new Client(clientProps), [
            { field: 'name', message: 'Name must be at least 3 characters long.' },
        ]);
    });

    it('should throw an error when client e-mail is empty', async () => {

        const clientProps = {
            id: new Id('1'),
            name: 'Sandra',
            email: '',
            documentType: 'CPF',
            document: '381.306.090-02',
            address,
        };

        expectValidationError(() => new Client(clientProps), [
            { field: 'email', message: 'Email is required.' },
        ]);
    });

    it('should throw an error when client invalid e-mail is empty', async () => {

        const clientProps = {
            id: new Id('1'),
            name: 'Sandra',
            email: 'clientemil.com',
            documentType: 'CPF',
            document: '381.306.090-02',
            address,
        };

        expectValidationError(() => new Client(clientProps), [
            { field: 'email', message: 'Invalid email, please provide a valid email.' },
        ]);
    });

    it('should throw an error when client document type is empty', async () => {

        const clientProps = {
            id: new Id('1'),
            name: 'Sandra',
            email: 'client@emil.com',
            documentType: '',
            document: '381.306.090-02',
            address,
        };

        expectValidationError(() => new Client(clientProps), [
            { field: 'documentType', message: 'Document Type is required.' },
        ]);
    });

    it('should throw an error when client document type is less than 3 characters', async () => {

        const clientProps = {
            id: new Id('1'),
            name: 'Sandra',
            email: 'client@emil.com',
            documentType: 'CP',
            document: '381.306.090-02',
            address,
        };

        expectValidationError(() => new Client(clientProps), [
            { field: 'documentType', message: 'Document Type must be at least 3 characters long.' },
        ]);
    });

    it('should throw an error when client document is empty', async () => {

        const clientProps = {
            id: new Id('1'),
            name: 'Sandra',
            email: 'client@emil.com',
            documentType: 'CPF',
            document: '',
            address,
        };

        expectValidationError(() => new Client(clientProps), [
            { field: 'document', message: 'Document is required.' },
        ]);
    });

    it('should throw an error when client invalid document is empty', async () => {

        const clientProps = {
            id: new Id('1'),
            name: 'Sandra',
            email: 'client@emil.com',
            documentType: 'CPF',
            document: '381.306.090-0',
            address,
        };

        expectValidationError(() => new Client(clientProps), [
            { field: 'document', message: 'Invalid document, CPF must contain exactly 11 digits.' },
        ]);
    });

    it('should throw an error when address has multiple invalid fields', () => {

        try {
          new Address('', '', '', '', '');
        } catch (e) {
          expect(e).toBeInstanceOf(ValidationException);
          const err = e as ValidationException;
          expect(err.errors.length).toBeGreaterThanOrEqual(4);
          const fields = err.errors.map(e => e.field);
          expect(fields).toContain('street');
          expect(fields).toContain('number');
          expect(fields).toContain('city');
          expect(fields).toContain('state');
          expect(fields).toContain('zipCode');
        }
      });

      it('should throw an error when creating a client with invalid address', () => {

          expect(() => {

            const invalidAddress = new Address('Paulista', '', 'São Paulo', 'SP', '0110-100', '');

            new Client({
                id: new Id('1'),
                name: 'Sandra',
                email: 'test@example.com',
                documentType: 'CPF',
                document: '123.456.789-00',
                address: invalidAddress,
            });

        }).toThrowError(ValidationException);
    });
});