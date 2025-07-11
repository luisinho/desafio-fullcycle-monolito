import BaseEntity from "@shared/domain/entity/base.entity";
import Id from "@shared/domain/value-object/id.value-object";
import AggregateRoot from "@shared/domain/entity/aggregate-root.interface";

type InvoiceItemProps = {
    id?: InvoiceItemId,
    name: string,
    price: number,
    quantity: number,
};

export class InvoiceItemId extends Id {
    constructor(id: string) {
        super(id);
    }
};

export default class InvoiceItem extends BaseEntity implements AggregateRoot {

    private _name: string;
    private _price: number;
    private _quantity: number;

    constructor(props: InvoiceItemProps) {
        super(props.id);
        this._name  = props.name;
        this._price = props.price;
        this._quantity = props.quantity;
    }

    get name(): string {
        return this._name;
    }

    get price(): number {
        return this._price;
    }

    get quantity(): number {
        return this._quantity;
    }
}