export interface PaymentFacadeInputDto {
    orderId: string;
    amount: number;
}

export interface PaymentFacadeOutputDto {
    transactionId: string;
    orderId: string;
    amount: number;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface FindPaymentByOrderIdFacadeInputDto {
    orderId: string;
}

export default interface PaymentFacadeInterface {
    process(input: PaymentFacadeInputDto): Promise<PaymentFacadeOutputDto>;
    findByOrderId(input: FindPaymentByOrderIdFacadeInputDto): Promise<PaymentFacadeOutputDto>;
}