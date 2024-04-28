import type { ICategories } from '../../category/define'
import type { TFilterProduct } from './filter-product'

interface IProduct {
  id: string
  title: string
  description: string
  og_description: string
  og_title: string
  friendly_price: number
  origin_price: number
  sku: string
  availability: number
  og_url: string
  thumbnail: string
  quantity: number
  images: string[]
  variant: IProduct
  category: ICategories
}

export type { IProduct, TFilterProduct }
