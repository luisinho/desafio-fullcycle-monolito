export interface FindPlaceOrderByDocumentInputDto {
    document: string;
}

export interface FindPlaceOrderByDocumentOutputDto {
     id: string;
     document: string;
     name: string;
     invoiceId?: string;
     clientId?: string;
     status: string;
     items: {
        productId?: string;
        name: string;
        salesPrice: number;
        quantity: number;
      }[];
      total: number;
      createdAt: Date;
}