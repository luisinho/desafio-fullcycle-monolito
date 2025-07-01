import InvoiceFacadeInterface  from "./invoice-facade.interface";
import UseCaseInterface from "@shared/usecase/use-case.interface";
import { FindInvoiceUseCaseInputDto, FindInvoiceUseCaseOutputDto,
    GenerateInvoiceUseCaseInputDto, GenerateInvoiceUseCaseOutputDto, ListInvoiceByIdsUseCaseInputDto } from "./invoice-facade.interface";

export interface UseCasesProps {
    findUseCase: UseCaseInterface;
    generateUseCase: UseCaseInterface;
    listByIdsUseCase: UseCaseInterface;
};

export default class InvoiceFacade implements InvoiceFacadeInterface {

    private _findUseCase: UseCaseInterface;
    private _generateUseCase: UseCaseInterface;
    private _listByIdsUseCase: UseCaseInterface;

    constructor(useCasesProps: UseCasesProps) {
        this._findUseCase = useCasesProps.findUseCase;
        this._generateUseCase = useCasesProps.generateUseCase;
        this._listByIdsUseCase = useCasesProps.listByIdsUseCase;
    }

   async find(input: FindInvoiceUseCaseInputDto): Promise<FindInvoiceUseCaseOutputDto> {
        return await this._findUseCase.execute(input);
    }

    async generate(input: GenerateInvoiceUseCaseInputDto): Promise<GenerateInvoiceUseCaseOutputDto> {
        return await this._generateUseCase.execute(input);
    }

    async listByIds(input: ListInvoiceByIdsUseCaseInputDto): Promise<FindInvoiceUseCaseOutputDto[]> {
        return await this._listByIdsUseCase.execute(input);
    }
}