import Client from "./client.entity";
import Address from "../../@shared/domain/value-object/address";
import Id from "../../@shared/domain/value-object/id.value-object";
import { ValidationException } from "@shared/domain/validation/validation.exception";

describe("Client Entity unit test", () => {

  const makeValidAddress = () =>
    new Address('Paulista', '3', 'São Paulo', 'SP', '01103-100', 'apt 22');

  it('should create a valid client', () => {
    const address = makeValidAddress();

    const client = new Client({
      id: new Id('1'),
      name: 'Sandra',
      email: 'client@email.com',
      documentType: 'CPF',
      document: '381.306.090-02',
      address,
    });

    expect(client.name).toBe('Sandra');
    expect(client.email).toBe('client@email.com');
    expect(client.address).toEqual(address);
  });

  it('should throw an error address has invalid street', () => {
    expect(() => {
      new Address('', '3', 'São Paulo', 'SP', '01103-100');
    }).toThrowError(ValidationException);

    expect(() => {
      new Address('Av', '3', 'São Paulo', 'SP', '01103-100');
    }).toThrowError(ValidationException);
  });

  it('should throw an error address number is missing', () => {
    expect(() => {
      new Address('Paulista', '', 'São Paulo', 'SP', '01103-100');
    }).toThrowError(ValidationException);
  });

  it('should throw an error city is missing or too short', () => {
    expect(() => {
      new Address('Paulista', '3', '', 'SP', '01103-100');
    }).toThrowError(ValidationException);

    expect(() => {
      new Address('Paulista', '3', 'AB', 'SP', '01103-100');
    }).toThrowError(ValidationException);
  });

  it('should throw an error state is missing or too short', () => {
    expect(() => {
      new Address('Paulista', '3', 'São Paulo', '', '01103-100');
    }).toThrowError(ValidationException);

    expect(() => {
      new Address('Paulista', '3', 'São Paulo', 'S', '01103-100');
    }).toThrowError(ValidationException);
  });

  it('should throw an error zip code is invalid', () => {
    expect(() => {
      new Address('Paulista', '3', 'São Paulo', 'SP', '');
    }).toThrowError(ValidationException);

    expect(() => {
      new Address('Paulista', '3', 'São Paulo', 'SP', 'ABC12');
    }).toThrowError(ValidationException);

    expect(() => {
      new Address('Paulista', '3', 'São Paulo', 'SP', '1234');
    }).toThrowError(ValidationException);
  });
});
