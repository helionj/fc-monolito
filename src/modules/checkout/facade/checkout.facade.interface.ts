export interface AddOrderFacadeInputDto{
  clientId:string,
  products: {
    productId: string
  }[],

}

export interface AddOrderFacadeOutputDto{
  id?: string,
  invoiceId: string,
  status: string,
  total: number,
  products: {
    productId: string
  }[],

}

export interface FindOrderFacadeOutputDto {
  id?: string,
  clientId: string,
  clienttName: string,
  clientEmail: string,
  address: string,
  status: string,
  total: number,
  products: {
    productId: string
  }[],
}

export interface FindOrderFacadeInputDto{
  id: string;
}


export interface CheckOutFacadeInterface {

  addOrder(input: AddOrderFacadeInputDto): Promise<AddOrderFacadeOutputDto>;
  findOrder(input: FindOrderFacadeInputDto): Promise<FindOrderFacadeOutputDto>;
}

