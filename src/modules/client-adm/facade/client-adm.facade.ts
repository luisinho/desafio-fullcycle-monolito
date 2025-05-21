import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import ClientAdmFacadeInterface, { AddClientFacadeInputDto, AddClientOutputDto, FindClientFacadeInputDto, FindClientFacadeOutputDto } from "./client-adm.facade.interface";

export interface UseCaseProps {
    addUseCase: UseCaseInterface;
    findUseCase: UseCaseInterface;
};

export default class ClientAdmFacade implements ClientAdmFacadeInterface {

    private _addUseCase: UseCaseInterface;
    private _findUseCase: UseCaseInterface;

    constructor(useCaseProps: UseCaseProps){
        this._addUseCase = useCaseProps.addUseCase;
        this._findUseCase = useCaseProps.findUseCase;
    }

    async add(input: AddClientFacadeInputDto): Promise<AddClientOutputDto> {
       return await this._addUseCase.execute(input);
    }

    async find(input: FindClientFacadeInputDto): Promise<FindClientFacadeOutputDto> {
        return await this._findUseCase.execute(input);
    }
}