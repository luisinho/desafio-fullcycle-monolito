import { InvoiceModel } from "./invoice.model";
import InvoiceItemModel from "./invoice-item.model";
import InvoiceGateway from "../gateway/invoice.gateway";
import Invoice, { InvoiceId } from "../domain/invoice.entity";
import Address from "../../@shared/domain/value-object/address";
import InvoiceItem, { InvoiceItemId } from "../domain/invoice-item.entity";

export default class InvoiceRepository implements InvoiceGateway {

   async find(id: string): Promise<Invoice> {

      const invoice = await InvoiceModel.findOne({
          where: { id },
          include: ['items'],
      });

      if (!invoice) {
         throw new Error(`Invoice with id ${id} not found!`);
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
        items: invoice.items.map((item: InvoiceItem) => ({
            id: item.id.id,
            name: item.name,
            price: item.price,
        })),
        createdAt: new Date(),
        updatedAt: new Date(),
     },
     {
        include: [{model: InvoiceItemModel, as: 'items'}],
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

   private getItens(invoice: InvoiceModel): InvoiceItem[] {

      let item: InvoiceItem;
      let items: InvoiceItem[] = [];

      invoice.items.map((itemModel: InvoiceItemModel) => {

        let props = {
            id: new InvoiceItemId(itemModel.id),
            name: itemModel.name,
            price: itemModel.price,
        };

        item = new InvoiceItem(props);
        items.push(item);
      });

    return items;

   }
}