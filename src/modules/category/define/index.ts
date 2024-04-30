import type { IPaginationOptions } from '@/utils/define/pagination-options'

interface ICategories {
  name: string
  parent: ICategories
  children: ICategories[]
  created_at: Date
  updated_at: Date
  deleted_at: Date
  sort: number
  _id: string
}

interface TFilterCategories extends IPaginationOptions {
  name?: string
  home?: boolean
}

export type { ICategories, TFilterCategories }
