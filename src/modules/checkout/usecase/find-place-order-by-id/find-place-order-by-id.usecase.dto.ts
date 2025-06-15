export interface FindPlaceOrderByIdInputDto {
    id: string;
}

export interface FindPlaceOrderByIdOutputDto {
     id: string;
     document: string;
     nome: string;
     status: string;
     items: {
        name: string;
        price: number;
        quantity: number;
      }[];
      total: number;
      createdAt: Date;
}