import Product from "./product";
import Id from "../../@shared/domain/value-object/id.value-object";
import { expectValidationError } from "../../../infrastructure/test/utils/expect-validation-error";

describe("Product domain entity validation", () => {

  it('should throw error when name is empty', () => {
    expectValidationError(
      () =>
        new Product({
          id: new Id('1'),
          name: '',
          description: 'Valid description',
          purchasePrice: 10,
          stock: 1,
        }),
      [{ field: 'name', message: 'Name is required.' }]
    );
  });

  it('should throw error when name is too short', () => {
    expectValidationError(
      () =>
        new Product({
          id: new Id('1'),
          name: 'ab',
          description: 'Valid description',
          purchasePrice: 10,
          stock: 1,
        }),
      [{ field: 'name', message: 'Name must be at least 3 characters long.' }]
    );
  });

  it('should throw error when description is empty', () => {
    expectValidationError(
      () =>
        new Product({
          id: new Id('1'),
          name: 'Valid Name',
          description: '',
          purchasePrice: 10,
          stock: 1,
        }),
      [{ field: 'description', message: 'Description is required.' }]
    );
  });

  it('should throw error when description is too short', () => {
    expectValidationError(
      () =>
        new Product({
          id: new Id('1'),
          name: 'Valid Name',
          description: 'abcd',
          purchasePrice: 10,
          stock: 1,
        }),
      [{ field: 'description', message: 'Description must be at least 5 characters long.' }]
    );
  });

  it('should throw error when purchase price is zero or negative', () => {
    expectValidationError(
      () =>
        new Product({
          id: new Id('1'),
          name: 'Valid Name',
          description: 'Valid description',
          purchasePrice: 0,
          stock: 1,
        }),
      [{ field: 'purchasePrice', message: 'Purchase price must be greater than 0.' }]
    );
  });

  it('should throw error when stock is negative', () => {
    expectValidationError(
      () =>
        new Product({
          id: new Id('1'),
          name: 'Valid Name',
          description: 'Valid description',
          purchasePrice: 100,
          stock: -5,
        }),
      [{ field: 'stock', message: 'Stock cannot be negative.' }]
    );
  });

  it('should create a valid product', () => {
    const product = new Product({
      id: new Id('1'),
      name: 'Valid Name',
      description: 'A valid description',
      purchasePrice: 100,
      stock: 5,
    });

    expect(product.name).toBe('Valid Name');
    expect(product.description).toBe('A valid description');
    expect(product.purchasePrice).toBe(100);
    expect(product.salesPrice).toBe(130);
    expect(product.stock).toBe(5);
  });
});