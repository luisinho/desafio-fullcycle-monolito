import  InvoiceGateway  from "../../gateway/invoice.gateway";
import { NotFoudException } from "@shared/domain/validation/not-found.exception";
import { ListInvoiceByIdsUseCaseInputDto, ListInvoiceByIdsUseCaseOutputDto } from "./list-invoice-by.ids.dto";

export default class ListInvoiceByIdsUseCase {

    private _invoiceRepository: InvoiceGateway;

    constructor(invoiceRepository: InvoiceGateway) {
        this._invoiceRepository = invoiceRepository;
    }

    async execute(input: ListInvoiceByIdsUseCaseInputDto): Promise<ListInvoiceByIdsUseCaseOutputDto[]> {

        const invoices = await this._invoiceRepository.listByIds(input.ids);

        if (invoices.length === 0) {
            throw new NotFoudException(`Invoices not found!`);
        }

        return invoices.map(invoice => ({
           id: invoice.id.id,
           name: invoice.name,
           document: invoice.document,
           address: {
             street: invoice.address.street,
             number: invoice.address.number,
             complement: invoice.address.complement,
             city: invoice.address.city,
             state: invoice.address.state,
             zipCode: invoice.address.zipCode,
           },
           items: invoice.items.map(item => ({
             id: item.id.id,
             name: item.name,
             price: item.price,
             quantity: item.quantity,
           })),
           total: invoice.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
           createdAt: invoice.createdAt,
        }));
    }
}