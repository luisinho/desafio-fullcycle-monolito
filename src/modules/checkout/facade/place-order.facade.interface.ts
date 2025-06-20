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
    items: {
        productId: string;
        name: string;
        salesPrice: number,
        quantity: number,
    }[];
}

export interface FindOrderByIdInputDto {
    id: string;
}

export default interface PlaceOrderFacadeInterface {
    addOrder(input: PlaceOrderInputDto): Promise<PlaceOrderOutputDto>;
    findOrderById(input: FindOrderByIdInputDto): Promise<PlaceOrderOutputDto | null>;
}