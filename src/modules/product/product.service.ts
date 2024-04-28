import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Product } from '@/modules/product/product.entity'
import { MongoRepository } from 'typeorm'
import { CreateProductDto } from '@/modules/product/dto/create-product.dto'
import { IResponse, IResponsePagination } from '@define/response'
import { IProduct, TFilterProduct } from './define'
import { CategoryService } from '../category/category.service'
import { ObjectId } from 'mongodb'
import { addDomainToImage } from '@/common/helper/file.helper'

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private readonly productService: MongoRepository<Product>,
    private readonly categoryService: CategoryService
  ) {}

  async createProduct(createProductDto: CreateProductDto): Promise<IResponse<Product>> {
    const {
      title,
      description,
      og_description,
      og_title,
      friendly_price,
      origin_price,
      sku,
      availability,
      og_url,
      thumbnail,
      quantity,
      images,
      variant_id,
      category_id
    } = createProductDto
    let variant = null
    if (variant_id) {
      variant = await this.productService.findOne({ where: { _id: variant_id }, relations: ['category'] })
    }
    if (variant && variant.deleted_at) {
      return {
        status: false,
        message: 'Sản phẩm biến thể không tồn tại',
        data: null
      }
    }
    const category = await this.categoryService.getCategoryById(category_id)
    if (!category) {
      return {
        status: false,
        message: 'Danh mục không tồn tại',
        data: null
      }
    }
    const newProduct = this.productService.create({
      title,
      description,
      og_description,
      og_title,
      friendly_price: Number(friendly_price),
      origin_price: Number(origin_price),
      sku,
      availability: Number(availability),
      og_url,
      thumbnail,
      quantity: Number(quantity),
      images,
      category,
      variant
    })
    await this.productService.save(newProduct)
    return {
      status: true,
      message: 'Tạo sản phẩm thành công',
      data: newProduct
    }
  }
}
