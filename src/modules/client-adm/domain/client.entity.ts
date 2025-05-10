import Address from "../../@shared/domain/value-object/address";
import BaseEntity from "../../@shared/domain/entity/base.entity";
import Id from "../../@shared/domain/value-object/id.value-object"
import AggregateRoot from "../../@shared/domain/entity/aggregate-root.interface";
import { ValidationException, ValidationError } from '../../@shared/domain/validation/validation.exception';

type ClientProps = {
    id?: Id;
    name: string;
    email: string;
    documentType: string;
    document: string;
    address: Address;
    createdAt?: Date;
    updatedAt?: Date;
};

export default class Client extends BaseEntity implements AggregateRoot {

    private _name: string;
    private _email: string;
    private _documentType: string;
    private _document: string;
    private _address: Address;

    constructor(clientProps: ClientProps) {
        super(clientProps.id, clientProps.createdAt, clientProps.updatedAt);
        this._name = clientProps.name;
        this._email = clientProps.email;
        this._documentType = clientProps.documentType;
        this._document = clientProps.document;
        this._address = clientProps.address;
        this.validate();
    }

    get name(): string {
        return this._name;
    }

    get email(): string {
        return this._email;
    }

    get documentType(): string {
        return this._documentType;
    }

    get document(): string {
        return this._document;
    }

    get address(): Address {
        return this._address;
    }

    validate(): void {

        const errors: ValidationError[] = [];

        if (!this._name || this._name.trim().length === 0) {
            errors.push({ field: 'name', message: 'Name is required.' });
        } else if (this._name.length < 3) {
            errors.push({ field: 'name', message: 'Name must be at least 3 characters long.' });
        }

        if (!this._email || this._email.trim().length === 0) {
            errors.push({ field: 'email', message: 'Email is required.' });
        } else if (!this._email.includes('@')) {
            errors.push({ field: 'email', message: 'Invalid email, please provide a valid email.' });
        }

        if (!this._documentType || this._documentType.trim().length === 0) {
            errors.push({ field: 'documentType', message: 'Document Type is required.' });
        } else if (this._documentType.length < 3) {
            errors.push({ field: 'documentType', message: 'Document Type must be at least 3 characters long.' });
        }

        if (!this._document || this._document.trim().length === 0) {
            errors.push({ field: 'document', message: 'Document is required.' });
        } else if (!/^\d{11}$/.test(this._document.replace(/\D/g, ''))) {
            errors.push({ field: 'document', message: 'Invalid document, CPF must contain exactly 11 digits.' });
        }

        if (errors.length > 0) {
            throw new ValidationException(errors);
        }
    }
}