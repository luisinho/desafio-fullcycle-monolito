export interface FindPaymentByOrderIdInputDto {
    orderId: string;
}

export interface FindProcessPaymentByOrderIdOutputDto {
    transactionId: string;
    orderId: string;
    amount: number;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}