import { ValidationException } from "../../../modules/@shared/domain/validation/validation.exception";

export function expectValidationError(
  fn: () => any,
  expectedErrors: { field: string; message: string }[]
) {
  try {
    fn();
    throw new Error("Expected ValidationException to be thrown, but none was thrown.");
  } catch (error) {
    if (error instanceof ValidationException) {
      expect(error.errors).toEqual(
        expect.arrayContaining(
          expectedErrors.map((e) =>
            expect.objectContaining({
              field: e.field,
              message: e.message,
            })
          )
        )
      );
    } else {
      throw new Error(`Expected ValidationException but got: ${error}`);
    }
  }
}