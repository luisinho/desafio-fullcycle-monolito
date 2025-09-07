import PaymentFacadeInterface from "./facade.interface";
import UseCaseInterface from "@shared/usecase/use-case.interface";
import { PaymentFacadeInputDto, FindPaymentByOrderIdFacadeInputDto, PaymentFacadeOutputDto } from "./facade.interface";

export interface UseCaseProps {
    processUseCase: UseCaseInterface;
    findPaymentByOrderIdUsecase: UseCaseInterface;
};

export default class PaymentFacade implements PaymentFacadeInterface {

    private _processUseCase: UseCaseInterface;
    private _findPaymentByOrderIdUsecase: UseCaseInterface;

    constructor(useCaseProps: UseCaseProps) {
        this._processUseCase = useCaseProps.processUseCase;
        this._findPaymentByOrderIdUsecase = useCaseProps.findPaymentByOrderIdUsecase;
    }

    async process(input: PaymentFacadeInputDto): Promise<PaymentFacadeOutputDto> {
        return await this._processUseCase.execute(input);
    }

    async findByOrderId(input: FindPaymentByOrderIdFacadeInputDto): Promise<PaymentFacadeOutputDto> {
        return await this._findPaymentByOrderIdUsecase.execute(input);
    }
}