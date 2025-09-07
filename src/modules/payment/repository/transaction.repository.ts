import { TransactionModel } from "./transaction.model";
import PaymentGateway from "../gateway/payment.gateway";
import Transaction, { TransactionId } from "../domain/transaction";

export default class TransactionRepository implements PaymentGateway {

    async save(input: Transaction): Promise<Transaction> {
      const transaction =   await TransactionModel.create({
            id: input.id.id,
            orderId: input.orderId,
            amount: input.amount,
            status: input.status,
            createdAt: input.createdAt,
            updatedAt: input.updatedAt,
        });

        return new Transaction({
            id: new TransactionId(transaction.id),
            orderId: transaction.orderId,
            amount: transaction.amount,
            status: transaction.status,
            createdAt: transaction.createdAt,
            updatedAt: transaction.updatedAt,
        });
    }

    async findByOrderId(orderId: string): Promise<Transaction> {

        const transaction = await TransactionModel.findOne({ where: { orderId: orderId } });

        if (!transaction) {
            return null;
        }

        return new Transaction({
            id: new TransactionId(transaction.id),
            orderId: transaction.orderId,
            amount: transaction.amount,
            status: transaction.status,
            createdAt: transaction.createdAt,
            updatedAt: transaction.updatedAt,
        });
    }
}