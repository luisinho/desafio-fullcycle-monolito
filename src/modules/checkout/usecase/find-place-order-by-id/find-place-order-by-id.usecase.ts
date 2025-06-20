import CheckoutGateway from "../../gateway/checkout.gateway";

import InvoiceFacadeInterface from "../../../invoice/facade/invoice-facade.interface";
import { FindPlaceOrderByIdInputDto, FindPlaceOrderByIdOutputDto } from "./find-place-order-by-id.usecase.dto";

export default class FindPlaceOrderByIdUsecase {

     private _repository: CheckoutGateway;
     private _invoiceFacade: InvoiceFacadeInterface;

     constructor(repository: CheckoutGateway, invoiceFacade: InvoiceFacadeInterface) {
        this._repository = repository;
        this._invoiceFacade = invoiceFacade;
     }

     async execute(input: FindPlaceOrderByIdInputDto): Promise<FindPlaceOrderByIdOutputDto> {

        const order = await this._repository.findOrderById(input.id);

        const invoice = await this._invoiceFacade.find({ id: order.invoiceId });

        return {
           id: order.id.id,
           document: invoice.document,
           name: invoice.name,
           invoiceId: order.invoiceId,
           clientId: order.clientId,
           status: order.status,
           items: order.products.map(item => ({
                productId: item.id.id,
                name: item.name,
                salesPrice: item.salesPrice,
                quantity: item.quantity,
           })),
           total: order.total,
           createdAt: order.createdAt,
        };
     }
}