import Client from "./client.entity";
import Product from "./product.entity";
import BaseEntity from "../../@shared/domain/entity/base.entity";
import Id from "../../@shared/domain/value-object/id.value-object";

type OrderProps = {
    id?: OrderId;
    client: Client;
    clientId?: string;
    products: Product[];
    status?: string;
    invoiceId?: string;
};

export class OrderId extends Id {
    constructor(id: string) {
        super(id);
    }
};

export default class Order extends BaseEntity {

    private _client: Client;
    private _clientId: string;
    private _products: Product[];
    private _status?: string;
    private _invoiceId?: string;

    constructor(props: OrderProps) {
        super(props.id);
        this._client = props.client;
        this._clientId = props.clientId;
        this._products = props.products;
        this._status = props.status || 'pending';
        this._invoiceId = props.invoiceId;
    }

    approved(): void {
      this._status = 'approved';
    }

    declined(): void {
        this._status = 'declined';
    }

    get client(): Client {
        return this._client;
    }

    get clientId(): string {
        return this._clientId;
    }

    get products(): Product[] {
        return this._products;
    }

    get status(): string {
        return this._status;
    }

    get invoiceId(): string {
        return this._invoiceId;
    }

    changeInvoiceId(invoiceId: string): void {
        this._invoiceId = invoiceId;
    }

    get total(): number {
        return this._products.reduce((total, product) => {
            return total + (product.salesPrice * product.quantity);
        }, 0);
    }
}