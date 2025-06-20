export interface PlaceOrderInputDto {
    clientId: string;
    document: string;
    products: {
        productId: string;
        quantity: number;
    }[];
}

export interface PlaceOrderOutputDto {
    id: string;
    invoiceId: string;
    clientId: string;
    status: string;
    total: number;
    createdAt: Date;
    items: {
        productId: string;
        name: string;
        quantity: number;
    }[];
}