import AggregateRoot from "../../@shared/domain/entity/aggregate-root.interface";
import BaseEntity from "../../@shared/domain/entity/base.entity";
import Id from "../../@shared/domain/value-object/id.value-object"

type ClientProps = {
    id?: Id;
    name: string;
    email: string;
    address: string;    
    createdAt?: Date;
    updatedAt?: Date;
};

export default class Client extends BaseEntity implements AggregateRoot {

    private _name: string;
    private _email: string;
    private _address: string;

    constructor(clientProps: ClientProps) {
        super(clientProps.id, clientProps.createdAt, clientProps.updatedAt);
        this._name = clientProps.name;
        this._email = clientProps.email;
        this._address = clientProps.address;
    }

    get name(): string {
        return this._name;
    }

    get email(): string {
        return this._email;
    }

    get address(): string {
        return this._address;
    }
}