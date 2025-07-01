export type ValidationError = {
    field: string;
    message: string;
};

export class ValidationException extends Error {

    public errors: ValidationError[];

    constructor(errors: ValidationError[]) {
       super('Validation failed');
       this.errors = errors;
       this.name = 'ValidationException';
       Object.setPrototypeOf(this, ValidationException.prototype);
    }
}