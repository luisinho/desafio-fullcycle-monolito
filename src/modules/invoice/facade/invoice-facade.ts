import InvoiceFacadeInterface  from "./invoice-facade.interface";
import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import { FindInvoiceUseCaseInputDto, FindInvoiceUseCaseOutputDto, GenerateInvoiceUseCaseInputDto, GenerateInvoiceUseCaseOutputDto } from "./invoice-facade.interface";

export interface UseCasesProps {
    findUseCase: UseCaseInterface;
    generateUseCase: UseCaseInterface;
};

export default class InvoiceFacade implements InvoiceFacadeInterface {

    private _findUseCase: UseCaseInterface;
    private _generateUseCase: UseCaseInterface;

    constructor(useCasesProps: UseCasesProps) {
        this._findUseCase = useCasesProps.findUseCase;
        this._generateUseCase = useCasesProps.generateUseCase;
    }

    find(input: FindInvoiceUseCaseInputDto): Promise<FindInvoiceUseCaseOutputDto> {
        return this._findUseCase.execute(input);
    }

    generate(input: GenerateInvoiceUseCaseInputDto): Promise<GenerateInvoiceUseCaseOutputDto> {
        return this._generateUseCase.execute(input);
    }
}