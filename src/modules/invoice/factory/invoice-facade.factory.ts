import InvoiceFacade from "../facade/invoice-facade";
import InvoiceRepository from "../repository/invoice.repository";
import FindInvoiceUseCase from "../usecase/find-invoice/find-invoice.usecase";
import GenerateInvoiceUseCase from "../usecase/generate-invoice/generate.invoice.usecase";
import InvoiceFacadeInterface from "../facade/invoice-facade.interface";

export default class InvoiceFacadeFactory {

    static create(): InvoiceFacadeInterface {

        const invoiceRepository = new InvoiceRepository();
        const findUseCase = new FindInvoiceUseCase(invoiceRepository);
        const generateUseCase = new GenerateInvoiceUseCase(invoiceRepository);

        const invoiceFacade = new InvoiceFacade({
            findUseCase: findUseCase,
            generateUseCase: generateUseCase,
          });

          return invoiceFacade;
    }
}