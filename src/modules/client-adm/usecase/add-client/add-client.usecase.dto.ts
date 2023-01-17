export interface AddClientUseCaseInputDto {
  id?: string,
  name: string,
  email: string,
  document: string,
  street: string,
  number: string,
  complement: string,
  city: string,
  zipCode: string,
  state: string
  
}

export interface AddClientUseCaseOutputDto {
  id: string,
  name: string,
  email: string,
  document: string
  address: {
    street: string,
    number: string,
    complemet: string,
    city: string,
    zipCode: string,
    state: string
  }
  createdAt: Date,
  updatedAt: Date
}