import UseCaseInterface from "@shared/usecase/use-case.interface";
import PlaceOrderFacadeInterface, { PlaceOrderInputDto, PlaceOrderOutputDto, FindOrderByIdInputDto, FindPlaceOrderByDocumentInputDto } from "./place-order.facade.interface";

export interface UseCaseProps {
    addOrderUseCase: UseCaseInterface;
    findOrderByIdUsecase: UseCaseInterface;
    findPlaceOrderByDocumentUseCase: UseCaseInterface;
};

export default class PlaceOrderFacade implements PlaceOrderFacadeInterface {

    private _addOrderUseCase: UseCaseInterface;
    private _findOrderByIdUsecase: UseCaseInterface;
    private _findPlaceOrderByDocumentUseCase: UseCaseInterface;

    constructor(useCaseProps: UseCaseProps){
        this._addOrderUseCase = useCaseProps.addOrderUseCase;
        this._findOrderByIdUsecase = useCaseProps.findOrderByIdUsecase;
        this._findPlaceOrderByDocumentUseCase = useCaseProps.findPlaceOrderByDocumentUseCase;
    }

    async addOrder(input: PlaceOrderInputDto): Promise<PlaceOrderOutputDto> {
        return await this._addOrderUseCase.execute(input);
    }

    async findOrderById(input: FindOrderByIdInputDto): Promise<PlaceOrderOutputDto | null> {
        return await this._findOrderByIdUsecase.execute(input);
    }

    async findPlaceOrderByDocument(input: FindPlaceOrderByDocumentInputDto): Promise<PlaceOrderOutputDto[]> {
        return await this._findPlaceOrderByDocumentUseCase.execute(input);
    }
}