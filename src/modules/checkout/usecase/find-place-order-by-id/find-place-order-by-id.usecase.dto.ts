export interface FindPlaceOrderByIdInputDto {
    id: string;
}

export interface FindPlaceOrderByIdOutputDto {
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