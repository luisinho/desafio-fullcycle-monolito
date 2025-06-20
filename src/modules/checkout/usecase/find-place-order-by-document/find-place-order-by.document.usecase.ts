import Order from "../../domain/order.entity";
import Product from "../../domain/product.entity";
import CheckoutGateway from "../../gateway/checkout.gateway";
import { NotFoudException } from '@shared/domain/validation/not-found.exception';
import InvoiceFacadeInterface from "../../../invoice/facade/invoice-facade.interface";
import ClientAdmFacadeInterface from "../../../client-adm/facade/client-adm.facade.interface";
import { FindPlaceOrderByDocumentInputDto, FindPlaceOrderByDocumentOutputDto } from "./find-place-order-by-document.usecase.dto";

export default class FindPlaceOrderByDocumentUsecase {

    private _repository: CheckoutGateway;
    private _invoiceFacade: InvoiceFacadeInterface;
    private _clientAdmFacade: ClientAdmFacadeInterface;

    constructor(repository: CheckoutGateway, invoiceFacade: InvoiceFacadeInterface, clientAdmFacade: ClientAdmFacadeInterface) {
        this._repository = repository;
        this._invoiceFacade = invoiceFacade;
        this._clientAdmFacade = clientAdmFacade;
    }

    async execute(input: FindPlaceOrderByDocumentInputDto): Promise<FindPlaceOrderByDocumentOutputDto[]> {

        const client = await this._clientAdmFacade.findByDocument({ document: input.document });

        const orders = await this._repository.findOrdersByClientId(client.id);

        if (orders.length === 0) {
            throw new NotFoudException(`No orders found for document ${input.document}.`);
        }

        const invoiceIds: string [] = orders.filter(order => order.invoiceId).map(order => order.invoiceId);

        const inputIds = {
            ids: invoiceIds
        }

        const invoices = await this._invoiceFacade.listByIds(inputIds);

        return orders.map((order: Order) => {

            let invoice = invoices.find(f => f.id === order.invoiceId);

            return {
                id: order.id.id,
                document: invoice ? invoice.document : '',
                name: invoice ? invoice.name : '',
                invoiceId: order.invoiceId,
                clientId: order.clientId,
                status: order.status,
                items: order.products.map((produto: Product) => ({
                    productId: produto.id.id,
                    name: produto.name,
                    salesPrice: produto.salesPrice,
                    quantity: produto.quantity,
                })),
                total: order.total,
                createdAt: order.createdAt,
            };
        });
    }
}