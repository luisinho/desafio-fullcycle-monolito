import Transaction from "../domain/transaction";

export default interface PaymentGateway {
    save(input: Transaction): Promise<Transaction>;
    findByOrderId(orderId: string): Promise<Transaction>;
}