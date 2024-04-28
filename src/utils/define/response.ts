import { Group } from '@/modules/group/group.schema'
import { ObjectId } from 'mongodb'

interface IBaseResponse {
  status: boolean
  code?: number
  message: string
}

interface IResponse<T> extends IBaseResponse {
  data: T
}

interface IResponsePagination<T> extends IBaseResponse {
  data: {
    data: T[]
    total_page: number
    total_page_record: number
    total_record: number
    current_page: number
  }
}

interface IGetUser {
  _id: ObjectId
  name: string
  phone_number: string
  email: string
  address: string
  token: string
  group: Group
}

export type { IResponse, IGetUser, IResponsePagination }
