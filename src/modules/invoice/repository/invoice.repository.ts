import { InvoiceModel } from "./invoice.model";
import { InvoiceItemModel } from "./invoice-item.model";
import InvoiceGateway from "../gateway/invoice.gateway";
import Invoice, { InvoiceId } from "../domain/invoice.entity";
import Address from "@shared/domain/value-object/address";
import InvoiceItem, { InvoiceItemId } from "../domain/invoice-item.entity";
import { NotFoudException } from "@shared/domain/validation/not-found.exception";

export default class InvoiceRepository implements InvoiceGateway {

   async find(id: string): Promise<Invoice> {

      const invoice = await InvoiceModel.findOne({
          where: { id },
          include: ['items'],
      });

      if (!invoice) {
           throw new NotFoudException(`Invoice with id ${id} not found.`);
      }

      const address = this.getAddress(invoice);

      const items: InvoiceItem[] = this.getItens(invoice);

      return new Invoice({
         id: new InvoiceId(invoice.id),
         name: invoice.name,
         document: invoice.document,
         address,
         items,
         createdAt: invoice.createdAt,
         updatedAt: invoice.updatedAt,
      });
   }

   async generate(invoice: Invoice): Promise<void> {

     await InvoiceModel.create({
        id: invoice.id.id,
        name: invoice.name,
        document: invoice.document,
        street: invoice.address.street,
        number: invoice.address.number,
        complement: invoice.address.complement,
        city: invoice.address.city,
        state: invoice.address.state,
        zipCode: invoice.address.zipCode,
        items: this.getItensGenerate(invoice),
        createdAt: new Date(),
        updatedAt: new Date(),
     },
     {
        include: [{model: InvoiceItemModel, as: 'items'}],
     });
   }

   async listByIds(ids: string[]): Promise<Invoice[]> {

      const invoices = await InvoiceModel.findAll({
         where: { id: ids },
         include: ['items'],
         order: [['createdAt', 'ASC']],
      });

      if (invoices.length === 0) {
         throw new NotFoudException('Invoices not found.');
      }

      return invoices.map((invoiceModel: InvoiceModel) => {

         const address = this.getAddress(invoiceModel);
         const items: InvoiceItem[] = this.getItens(invoiceModel);

         return new Invoice({
            id: new InvoiceId(invoiceModel.id),
            name: invoiceModel.name,
            document: invoiceModel.document,
            address,
            items,
            createdAt: invoiceModel.createdAt,
            updatedAt: invoiceModel.updatedAt,
         });
      });
   }

   private getAddress(invoice: InvoiceModel): Address {

      return  new Address(
            invoice.street,
            invoice.number,
            invoice.city,
            invoice.state,
            invoice.zipCode,
            invoice.complement);
   }

   private getItensGenerate(invoice: Invoice): InvoiceItemModel[] {

      let invoiceItemsModel: InvoiceItemModel[] = [];

      invoice.items.map((item: InvoiceItem) => {
         const invoiceItemModel = new InvoiceItemModel();

         invoiceItemModel.invoiceId = invoice.id.id,
         invoiceItemModel.name = item.name,
         invoiceItemModel.price = item.price,
         invoiceItemModel.quantity = item.quantity,
         // invoiceItemModel.createdAt = new Date();
         // invoiceItemModel.updatedAt = new Date();

         invoiceItemsModel.push(invoiceItemModel);
     });

      return invoiceItemsModel;
   }

   private getItens(invoice: InvoiceModel): InvoiceItem[] {

      let item: InvoiceItem;
      let items: InvoiceItem[] = [];

      invoice.items.map((itemModel: InvoiceItemModel) => {

        let props = {
            id: new InvoiceItemId(itemModel.id),
            name: itemModel.name,
            price: itemModel.price,
            quantity: itemModel.quantity,
        };

        item = new InvoiceItem(props);
        items.push(item);
      });

    return items;

   }
}