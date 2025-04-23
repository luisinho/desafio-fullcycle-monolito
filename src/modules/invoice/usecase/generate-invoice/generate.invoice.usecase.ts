import InvoiceGateway from "../../gateway/invoice.gateway";
import Invoice, { InvoiceId } from "../../domain/invoice.entity";
import Address from "../../../@shared/domain/value-object/address";
import InvoiceItem, { InvoiceItemId } from "../../domain/invoice-item.entity";
import { GenerateInvoiceUseCaseInputDto, GenerateInvoiceUseCaseOutputDto } from "./generate.invoice.dto";

export default class GenerateInvoiceUseCase {

    private _invoiceRepository: InvoiceGateway;

    constructor(invoiceRepository: InvoiceGateway) {
        this._invoiceRepository = invoiceRepository;
    }

    async execute(input: GenerateInvoiceUseCaseInputDto): Promise<GenerateInvoiceUseCaseOutputDto> {

        const address = new Address(
            input.street,
            input.number,
            input.city,
            input.state,
            input.zipCode,
            input.complement
        );

        const items = input.items.map(item => new InvoiceItem({
            id: new InvoiceItemId(item.id),
            name: item.name,
            price: item.price,
        }));

        const invoice = new Invoice({
            id: new InvoiceId(''),
            name: input.name,
            document: input.document,
            address,
            items,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        await this._invoiceRepository.generate(invoice);

        return {
            id: invoice.id.id,
            name: invoice.name,
            document: invoice.document,
            street: invoice.address.street,
            number: invoice.address.number,
            complement: invoice.address.complement,
            city: invoice.address.city,
            state: invoice.address.state,
            zipCode: invoice.address.zipCode,
            items: invoice.items.map(item => ({
                id: item.id.id,
                name: item.name,
                price: item.price,
            })),
            total: invoice.total,
        };
    }
}