import InvoiceItem from "./invoice-item.entity";
import Address from "@shared/domain/value-object/address";
import BaseEntity from "@shared/domain/entity/base.entity";
import Id from "@shared/domain/value-object/id.value-object";
import AggregateRoot from "@shared/domain/entity/aggregate-root.interface";

type InvoiceProps = {
    id?: InvoiceId,
    name: string,
    document: string,
    address: Address,
    items: InvoiceItem[],
    createdAt?: Date,
    updatedAt?: Date,
};

export class InvoiceId extends Id {
    constructor(id: string) {
        super(id);
    }
};

export default class Invoice extends BaseEntity implements AggregateRoot {

    private _name: string;
    private _document: string;
    private _address: Address;
    private _items: InvoiceItem [];

    constructor(props: InvoiceProps) {
        super(props.id);
        this._name = props.name;
        this._document = props.document;
        this._address = props.address;
        this._items = props.items;
    }

    get name(): string {
       return this._name;
    }

    get document(): string {
       return this._document;
    }

    get address(): Address {
       return this._address;
    }

    get items(): InvoiceItem[] {
       return this._items;
    }

    get total(): number {
        return this._items.reduce((total, item) => total + item.price, 0);
    }
}