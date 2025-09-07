import InvoiceGateway from "../../gateway/invoice.gateway";
import { NotFoudException } from "@shared/domain/validation/not-found.exception";
import { FindInvoiceUseCaseInputDto, FindInvoiceUseCaseOutputDto } from "./find-invoice.dto";

export default class FindInvoiceUseCase {

    private _invoiceRepository: InvoiceGateway;

    constructor(invoiceRepository: InvoiceGateway) {
        this._invoiceRepository = invoiceRepository;
    }

    async execute(input: FindInvoiceUseCaseInputDto): Promise<FindInvoiceUseCaseOutputDto> {

        const invoice = await this._invoiceRepository.find(input.id);

        if (!invoice) {
            throw new NotFoudException(`Invoice with id ${input.id} not found.`);
        }

        return {
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
           total: invoice.total,
           createdAt: invoice.createdAt,
        }
    }    
}