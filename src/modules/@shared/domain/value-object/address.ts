import { ValidationException, ValidationError } from "@shared/domain/validation/validation.exception";

export default class Address {

    private readonly _street: string;
    private readonly _number: string;
    private readonly _complement?: string;
    private readonly _city: string;
    private readonly _state: string;
    private readonly _zipCode: string;
  
    constructor(
      street: string,
      number: string,
      city: string,
      state: string,
      zipCode: string,
      complement?: string
    ) {      

      this._street = street;
      this._number = number;
      this._city = city;
      this._state = state;
      this._zipCode = zipCode;
      this._complement = complement;
      this.validate();
    }

    get street(): string {
      return this._street;
    }

    get number(): string {
      return this._number;
    }

    get complement(): string | undefined {
      return this._complement;
    }

    get city(): string {
      return this._city;
    }

    get state(): string {
      return this._state;
    }

    get zipCode(): string {
      return this._zipCode;
    }

    toString(): string {
      return `${this._street}, ${this._number}${this._complement ? ' - ' + this._complement : ''}, ${this._city} - ${this._state}, ${this._zipCode}`;
    }

    equals(other: Address): boolean {
      return (
        this._street === other.street &&
        this._number === other.number &&
        this._complement === other.complement &&
        this._city === other.city &&
        this._state === other.state &&
        this._zipCode === other.zipCode
      );
    }

    validate(): void {

        const errors: ValidationError[] = [];

        if (!this._street || this._street.trim().length === 0) {
            errors.push({ field: 'street', message: 'Street is required.' });
        } else if (this._street.length < 3) {
            errors.push({ field: 'street', message: 'Street must be at least 3 characters long.' });
        }

        if (!this._number || this._number.trim().length === 0) {
            errors.push({ field: 'number', message: 'Number is required.' });
        }

        if (!this._city || this._city.trim().length === 0) {
            errors.push({ field: 'city', message: 'City is required.' });
        } else if (this._city.length < 3) {
            errors.push({ field: 'city', message: 'City must be at least 3 characters long.' });
        }

        if (!this._state || this._state.trim().length === 0) {
            errors.push({ field: 'state', message: 'State is required.' });
        } else if (this._state.length < 2) {
            errors.push({ field: 'state', message: 'State must be at least 2 characters long.' });
        }

        if (!this._zipCode || this._zipCode.trim().length === 0) {
            errors.push({ field: 'zipCode', message: 'Zip Code is required.' });
        } else if (!/^\d{8}$/.test(this._zipCode.replace(/\D/g, ''))) {
            errors.push({ field: 'zipCode', message: 'Invalid document, Zip Code must contain exactly 8 digits.' });
        }

        if (errors.length > 0) {
            throw new ValidationException(errors);
        }
    }
  }