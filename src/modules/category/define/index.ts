import { ObjectId } from 'mongodb'

interface ICategories {
  name: string
  parent: ICategories
  children: ICategories[]
  created_at: Date
  updated_at: Date
  deleted_at: Date
  sort: number
  id: ObjectId
}

export type { ICategories }
