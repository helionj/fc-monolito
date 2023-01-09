export interface AddClientUseCaseInputDto {
  id?: string,
  name: string,
  email: string,
  address: string
}

export interface AddClientUseCaseOutputDto {
  id: string,
  name: string,
  email: string,
  address: string,
  createdAt: Date,
  updatedAt: Date
}