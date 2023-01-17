export interface FindOrderOutputDto {
  id?: string,
  clientId: string,
  clientName: string,
  clientEmail: string,
  address: string,
  status: string,
  total: number,
  products: {
    productId: string
  }[],
}

export interface FindOrderInputDto{
  id: string;
}