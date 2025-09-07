import PaymentFacade from "../facade/payment.facade";
import PaymentFacadeInterface from "../facade/facade.interface";
import TransactionRepository from "../repository/transaction.repository";
import ProcessPaymentUseCase from "../usecase/process-payment/process-payment.usecase";
import FindPaymentByOrderIdUseCase from "../usecase/find-payment-by-orderId/find-payment-by-orderId.usecase";

export default class PaymentFacadeFactory {

    static create(): PaymentFacadeInterface {

        const transactionRepository = new TransactionRepository();
        const processUseCase = new ProcessPaymentUseCase(transactionRepository);
        const findPaymentUseCase = new FindPaymentByOrderIdUseCase(transactionRepository);

        const facade = new PaymentFacade({
            processUseCase: processUseCase,
            findPaymentByOrderIdUsecase: findPaymentUseCase,
        });

        return facade;
    }
}