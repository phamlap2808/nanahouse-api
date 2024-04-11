interface IResponse<T> {
  status: boolean
  code?: number
  message: string
  data: T
}

export type { IResponse }
