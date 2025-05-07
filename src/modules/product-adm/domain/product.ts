import BaseEntity from '../../@shared/domain/entity/base.entity';
import Id from '../../@shared/domain/value-object/id.value-object';
import AggregateRoot from '../../@shared/domain/entity/aggregate-root.interface';
import { ValidationException, ValidationError } from '../../@shared/domain/validation/validation.exception';

type ProductProps = {
    id?: Id;
    name: string;
    description: string;
    purchasePrice: number;
    salesPrice?: number;
    stock: number;
    createdAt?: Date;
    updatedAt?: Date;
};

export default class Product extends BaseEntity implements AggregateRoot {

    private _name: string;
    private _description: string;
    private _purchasePrice: number;
    private _salesPrice: number;
    private _stock: number;

    constructor(props: ProductProps) {        
        super(props.id);
        this._name = props.name;
        this._description = props.description;
        this._purchasePrice = props.purchasePrice;
        this._salesPrice = props.salesPrice ?? this.calculateSalesPrice();
        this._stock = props.stock;
        this.validate();
    }

    get name(): string {
        return this._name;
    }

    get description(): string {
        return this._description;
    }

    get purchasePrice(): number {
        return this._purchasePrice;
    }

    get salesPrice(): number {
        return this._salesPrice;
    }

    get stock(): number {
        return this._stock
    }

    set name(name: string) {
        this._name = name;
    }

    set description(description:string) {
        this._description = description;
    }

    set purchasePrice(purchasePrice: number) {
        this._purchasePrice = purchasePrice;
        this._salesPrice = this.calculateSalesPrice();
    }

    set salesPrice(salesPrice: number) {
        this._salesPrice = salesPrice;
    }

    set stock(stock: number) {
        this._stock = stock;
    }

    private calculateSalesPrice(): number {
        return parseFloat((this._purchasePrice * 1.3).toFixed(2));
    }    

    validate(): void {

        const errors: ValidationError[] = [];

        if (!this._name || this._name.trim().length === 0) {
            errors.push({ field: 'name', message: 'Name is required.' });
        } else if (this._name.length < 3) {
            errors.push({ field: 'name', message: 'Name must be at least 3 characters long.' });
        }

        if (!this._description || this._description.trim().length === 0) {
            errors.push({ field: 'description', message: 'Description is required.' });
        } else if (this._description.length < 5) {
            errors.push({ field: 'description', message: 'Description must be at least 5 characters long.' });
        }

        if (this._purchasePrice <= 0) {
            errors.push({ field: 'purchasePrice', message: 'Purchase price must be greater than 0.' });
        }

        if (this._stock < 0) {
            errors.push({ field: 'stock', message: 'Stock cannot be negative.' });
        }

        if (errors.length > 0) {
            throw new ValidationException(errors);
        }
    }

    /*validate(): void {

        if (this._name.length === 0) {
            throw new Error('Name is required.');
        }

        if (this._name.length < 3) {
            throw new Error('Name must be at least 3 characters long.');
        }

        if (this.description.length === 0) {
           throw new Error('Description is required.');
        }

        if (this.description.length < 5) {
            throw new Error('Description must be at least 5 characters long.');
        }

        if (this._purchasePrice <= 0) {
            throw new Error('Purchase price must be greater than 0.');
        }

        if (this._stock < 0) {
            throw new Error('Stock cannot be negative.');
        }
    }*/
}