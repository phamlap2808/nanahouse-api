import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Product } from '@/modules/product/product.entity'
import { MongoRepository } from 'typeorm'
import { CreateProductDto } from '@/modules/product/dto/create-product.dto'
import { IResponse } from '@define/response'

@Injectable()
export class ProductService {
  constructor(@InjectRepository(Product) private readonly productService: MongoRepository<Product>) {}

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
      images
    } = createProductDto
    const newProduct = this.productService.create({
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
      images
    })
    try {
      await this.productService.save(newProduct)
      return {
        status: true,
        message: 'Success',
        data: newProduct
      }
    } catch (error) {
      return {
        status: false,
        message: error.message,
        data: null
      }
    }
  }
}
