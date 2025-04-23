import PaymentFacadeInterface from "./facade.interface";
import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import { PaymentFacadeInputDto, PaymentFacadeOutputDto } from "./facade.interface";

export default class PaymentFacade implements PaymentFacadeInterface {

    constructor(private readonly processPaymentUseCase: UseCaseInterface) {}

    process(input: PaymentFacadeInputDto): Promise<PaymentFacadeOutputDto> {
        return this.processPaymentUseCase.execute(input);
    }
}