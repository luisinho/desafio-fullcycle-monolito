import BaseEntity from "../../@shared/domain/entity/base.entity";
import Id from "../../@shared/domain/value-object/id.value-object";
import AggregateRoot from "../../@shared/domain/entity/aggregate-root.interface";

type ProductProps = {
    id?: ProductId;
    name: string;
    description: string;
    salesPrice: number;
    quantity: number;
};

export class ProductId extends Id {
    constructor(id: string) {
        super(id);
    }
};

export default class Product extends BaseEntity implements AggregateRoot {

    private _name: string;
    private _description: string;
    private _salesPrice: number;
    private _quantity: number;

    constructor(props: ProductProps) {
        super(props.id);
        this._name = props.name;
        this._description = props.description;
        this._salesPrice = props.salesPrice;
        this._quantity = props.quantity;
    }

    get name(): string {
        return this._name;
    }

    get description(): string {
        return this._description;
    }

    get salesPrice(): number {
        return this._salesPrice;
    }

    get quantity(): number {
        return this._quantity;
    }
}