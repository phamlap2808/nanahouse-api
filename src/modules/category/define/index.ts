import type { IPaginationOptions } from '@/utils/define/pagination-options'
import { Product } from '../../product/product.schema'
import { FlattenMaps } from 'mongoose'
import { Category } from '../category.schema'

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

interface ICategoryHome {
  products: Product[]
  _id: string
  name: string
  description: string
  sort: number
  parent: FlattenMaps<Category>
  children: FlattenMaps<Category>[]
  created_at: Date
  updated_at: Date
  deleted_at: Date
  id: string
}

export type { ICategories, TFilterCategories, ICategoryHome }
