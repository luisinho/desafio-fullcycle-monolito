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
      if (!street || !number || !city || !state || !zipCode) {
        throw new Error('All required address fields must be provided!');
      }

      this._street = street;
      this._number = number;
      this._city = city;
      this._state = state;
      this._zipCode = zipCode;
      this._complement = complement;
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
  }