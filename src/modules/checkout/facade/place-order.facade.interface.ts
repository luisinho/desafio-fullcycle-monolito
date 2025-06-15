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
    status: string;
    total: number;
    products: {
        productId: string;
    }[];
}

export default interface PlaceOrderFacadeInterface {
    addOrder(input: PlaceOrderInputDto): Promise<PlaceOrderOutputDto>;
    findOrderById(id: string): Promise<PlaceOrderOutputDto | null>;
}