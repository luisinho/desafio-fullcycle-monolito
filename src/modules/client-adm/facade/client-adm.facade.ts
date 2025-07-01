import UseCaseInterface from "@shared/usecase/use-case.interface";
import ClientAdmFacadeInterface,
{ AddClientFacadeInputDto, AddClientOutputDto,
    FindClientByIdFacadeInputDto, FindClientByDocumentFacadeInputDto, FindClientFacadeOutputDto } from "./client-adm.facade.interface";

export interface UseCaseProps {
    addUseCase: UseCaseInterface;
    findByIdUseCase: UseCaseInterface;
    findByDocumentUseCase: UseCaseInterface;
};

export default class ClientAdmFacade implements ClientAdmFacadeInterface {

    private _addUseCase: UseCaseInterface;
    private _findByIdUseCase: UseCaseInterface;
    private _findByDocumentUseCase: UseCaseInterface;

    constructor(useCaseProps: UseCaseProps){
        this._addUseCase = useCaseProps.addUseCase;
        this._findByIdUseCase = useCaseProps.findByIdUseCase;
        this._findByDocumentUseCase = useCaseProps.findByDocumentUseCase;
    }

    async add(input: AddClientFacadeInputDto): Promise<AddClientOutputDto> {
       return await this._addUseCase.execute(input);
    }

    async findById(input: FindClientByIdFacadeInputDto): Promise<FindClientFacadeOutputDto> {
        return await this._findByIdUseCase.execute(input);
    }

    async findByDocument(input: FindClientByDocumentFacadeInputDto): Promise<FindClientFacadeOutputDto> {
        return await this._findByDocumentUseCase.execute(input);
    }
}