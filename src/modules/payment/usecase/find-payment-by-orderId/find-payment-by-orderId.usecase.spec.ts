import Transaction from "../../domain/transaction";
import Id from "@shared/domain/value-object/id.value-object";
import FindPaymentByOrderIdUsecase from './find-payment-by-orderId.usecase';
import { NotFoudException } from "@shared/domain/validation/not-found.exception";

describe("FindPaymentByOrderIdUseCase (unit test)", () => {

    it('should find a payment by order id approved', async () => {

        const transaction = new Transaction({
            id: new Id('1'),
            orderId: 'order-1',
            amount: 100,
            status: 'approved',
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const paymentRepository = {
            save: jest.fn(),
            findByOrderId: jest.fn().mockReturnValue(Promise.resolve(transaction)),
        };

        const useCase = new FindPaymentByOrderIdUsecase(paymentRepository);

        const input = {
            orderId: 'order-1'
        };

        const result = await useCase.execute(input);

        expect(paymentRepository.findByOrderId).toHaveBeenCalled();
        expect(result.transactionId).toBeDefined();
        expect(result.transactionId).toBe(transaction.id.id);
        expect(result.orderId).toBe(transaction.orderId);
        expect(result.amount).toBe(transaction.amount);
        expect(result.status).toBe(transaction.status);
        expect(result.createdAt.getTime()).toBeCloseTo(transaction.createdAt.getTime(), -2);
        expect(result.updatedAt.getTime()).toBeCloseTo(transaction.updatedAt.getTime(), -2);
    });

    it('should throw an error when payment by orderId not found', async () => {

        const input = {
            orderId: 'order-2'
        };

        const paymentRepository = {
            save: jest.fn(),
            findByOrderId: jest.fn().mockImplementation(() => {
                throw new NotFoudException(`Payment with order id ${input.orderId} not found.`);
            }),
        };

        const useCase = new FindPaymentByOrderIdUsecase(paymentRepository);

        await expect(useCase.execute(input)).rejects.toThrow(new NotFoudException(`Payment with order id ${input.orderId} not found.`));
    });
});