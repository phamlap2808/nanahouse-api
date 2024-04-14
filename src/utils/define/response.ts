interface IResponse<T> {
  status: boolean
  code?: number
  message: string
  data: T
}

interface IGetUser {
  id: string
  name: string
  phone_number: string
  email: string
  address: string
  token
}

export type { IResponse, IGetUser }
