import type { IPaginationOptions } from '@/utils/define/pagination-options'

interface TFilterProduct extends IPaginationOptions {
  name?: string
  category?: string
}

export type { TFilterProduct }
