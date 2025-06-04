import UseCaseInterface from "@shared/usecase/use-case.interface";
import PlaceOrderFacadeInterface, { PlaceOrderInputDto, PlaceOrderOutputDto } from "./place-order.facade.interface";

export interface UseCaseProps {
    addOrderUseCase: UseCaseInterface;
    findOrderByIdUsecase: UseCaseInterface;
};

export default class PlaceOrderFacade implements PlaceOrderFacadeInterface {

    private _addOrderUseCase: UseCaseInterface;
    private _findOrderByIdUsecase: UseCaseInterface;

    constructor(useCaseProps: UseCaseProps){
        this._addOrderUseCase = useCaseProps.addOrderUseCase;
        this._findOrderByIdUsecase = useCaseProps.findOrderByIdUsecase;
    }

    async addOrder(input: PlaceOrderInputDto): Promise<PlaceOrderOutputDto> {
        return await this._addOrderUseCase.execute(input);
    }

    async findOrderById(id: string): Promise<PlaceOrderOutputDto | null> {
        return await this._findOrderByIdUsecase.execute(id);
    }
}