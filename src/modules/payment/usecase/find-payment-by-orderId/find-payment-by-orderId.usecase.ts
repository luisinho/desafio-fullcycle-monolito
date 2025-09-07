import  PaymentGateway  from '../../gateway/payment.gateway';
import { NotFoudException } from "@shared/domain/validation/not-found.exception";
import { FindPaymentByOrderIdInputDto, FindProcessPaymentByOrderIdOutputDto } from './find-payment-by-orderId.dto';

export default class FindPaymentByOrderIdUsecase {

    private _paymentRepository: PaymentGateway;

    constructor(paymentRepository: PaymentGateway) {
        this._paymentRepository = paymentRepository;
    }

    async execute(input: FindPaymentByOrderIdInputDto): Promise<FindProcessPaymentByOrderIdOutputDto> {

        const transaction = await this._paymentRepository.findByOrderId(input.orderId);

        if (!transaction) {
            throw new NotFoudException(`Payment with order id ${input.orderId} not found.`);
        }

        return {
            transactionId: transaction.id.id,
            orderId: transaction.orderId,
            amount: transaction.amount,
            status: transaction.status,
            createdAt: transaction.createdAt,
            updatedAt: transaction.updatedAt,
        };
    }
}