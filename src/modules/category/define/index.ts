import { ObjectId } from 'mongodb'
import type { IPaginationOptions } from '@/utils/define/pagination-options'

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

interface TFilterCategories extends IPaginationOptions {
  name?: string
}

export type { ICategories, TFilterCategories }
