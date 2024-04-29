import { Injectable } from '@nestjs/common'
import { Product } from '@/modules/product/product.schema'
import { CreateProductDto } from '@/modules/product/dto/create-product.dto'
import { IResponse, IResponsePagination } from '@define/response'
import { CategoryService } from '../category/category.service'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { TFilterProduct } from './define'
import { addDomainToImage } from '@/common/helper/file.helper'

@Injectable()
export class ProductService {
  constructor(
    @InjectModel('products') private readonly productModel: Model<Product>,
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
      variant = await this.productModel.findOne({ _id: variant_id }).lean()
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
    const newProduct = new this.productModel({
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
    await newProduct.save()
    newProduct.thumbnail = addDomainToImage(newProduct.thumbnail)
    return {
      status: true,
      message: 'Tạo sản phẩm thành công',
      data: newProduct.toObject()
    }
  }

  async getListProduct(query: TFilterProduct): Promise<IResponsePagination<Product>> {
    const currentPage = query.current_page || '1'
    const pageRecord = query.page_record || '10'
    const skip = (parseInt(currentPage) - 1) * parseInt(pageRecord)
    const search = query.name ? { name: { $regex: query.name, $options: 'i' } } : {}
    const products: Product[] = await this.productModel
      .find({
        ...search,
        deleted_at: null
      })
      .populate('category')
      .skip(skip)
      .limit(parseInt(pageRecord))
      .lean()
    products.forEach((product) => {
      product.thumbnail = addDomainToImage(product.thumbnail)
    })
    return {
      status: true,
      message: 'Success',
      data: {
        data: products,
        total_page: Math.ceil(products.length / parseInt(pageRecord)),
        total_page_record: parseInt(pageRecord),
        total_record: products.length,
        current_page: parseInt(currentPage)
      }
    }
  }
}
