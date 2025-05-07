import AggregateRoot from "../../@shared/domain/entity/aggregate-root.interface";
import BaseEntity from "../../@shared/domain/entity/base.entity";
import Id from "../../@shared/domain/value-object/id.value-object"

type ClientProps = {
    id?: Id;
    name: string;
    email: string;
    document: string;
    street: string;
    number: string;
    complement: string;
    city: string;
    state: string;
    zipCode: string;
    createdAt?: Date;
    updatedAt?: Date;
};

export default class Client extends BaseEntity implements AggregateRoot {

    private _name: string;
    private _email: string;
    private _document: string;
    private _street: string;
    private _number: string;
    private _complement: string;
    private _city: string;
    private _state: string;
    private _zipCode: string;
    private _address: string;

    constructor(clientProps: ClientProps) {
        super(clientProps.id, clientProps.createdAt, clientProps.updatedAt);
        this._name = clientProps.name;
        this._email = clientProps.email;
        this._document = clientProps.document;
        this._street = clientProps.street;
        this._number = clientProps.number;
        this._complement = clientProps.complement;
        this._city = clientProps.city;
        this._state = clientProps.state;
        this._zipCode = clientProps.zipCode;
    }

    get name(): string {
        return this._name;
    }

    get email(): string {
        return this._email;
    }

    get document(): string {
        return this._document;
    }

    get street(): string {
        return this._street;
    }

    get number(): string {
        return this._number;
    }

    get complement(): string {
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
}