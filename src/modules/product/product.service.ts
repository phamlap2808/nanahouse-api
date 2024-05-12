import { HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common'
import { Product } from '@/modules/product/product.schema'
import { CreateProductDto, UpdateProductDto } from '@/modules/product/dto/index.dto'
import { IResponse, IResponsePagination } from '@define/response'
import { CategoryService } from '../category/category.service'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { TFilterProduct } from './define'
import { addDomainToImage, deleteFile } from '@/common/helper/file.helper'
import { ObjectId } from 'mongodb'
import { Category } from '../category/category.schema'

@Injectable()
export class ProductService {
  constructor(
    @InjectModel('products') private readonly productModel: Model<Product>,
    @Inject(forwardRef(() => CategoryService)) private readonly categoryService: CategoryService
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
      category: category_id ? category : null,
      variant: variant_id ? variant : null
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
    const category = query.category ? await this.categoryService.getCategoryById(query.category) : null
    let queryDB: any = { ...search, deleted_at: null }
    if (query.category && !category) {
      return {
        code: HttpStatus.NOT_FOUND,
        status: false,
        message: 'Danh mục không tồn tại',
        data: null
      }
    }
    if (category) {
      queryDB = { ...queryDB, category }
    }
    const products: Product[] = await this.productModel
      .find(queryDB)
      .populate('category')
      .populate('variant')
      .skip(skip)
      .limit(parseInt(pageRecord))
      .lean()

    products.forEach((product) => {
      product.thumbnail = addDomainToImage(product.thumbnail)
      product._id = product._id.toString()
      product.category._id = product.category._id.toString()
      if (product.variant) {
        product.variant._id = product.variant._id.toString()
      }
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

  async getProductById(id: string): Promise<Product> {
    const _id = new ObjectId(id)
    const product = await this.productModel.findOne({ _id }).populate('category').populate('variant').exec()
    if (!product) {
      return null
    }
    if (product.deleted_at) {
      return null
    }
    return product.toObject()
  }

  async getProductDetail(id: string): Promise<IResponse<Product>> {
    const product = await this.getProductById(id)
    product.thumbnail = addDomainToImage(product.thumbnail)
    product.images.forEach((image, index) => {
      product.images[index] = addDomainToImage(image)
    })
    product._id = product._id.toString()
    product.category._id = product.category._id.toString()
    if (product.variant) {
      product.variant._id = product.variant._id.toString()
    }
    if (!product) {
      return {
        code: HttpStatus.NOT_FOUND,
        status: false,
        message: 'Sản phẩm không tồn tại',
        data: null
      }
    }
    return {
      status: true,
      message: 'Success',
      data: product
    }
  }

  async getProductsByCategory(query: TFilterProduct, category_id: string): Promise<IResponsePagination<Product>> {
    const currentPage = query.current_page || '1'
    const pageRecord = query.page_record || '10'
    const skip = (parseInt(currentPage) - 1) * parseInt(pageRecord)
    const search = query.name ? { name: { $regex: query.name, $options: 'i' } } : {}
    const category = await this.categoryService.getCategoryById(category_id)
    if (!category) {
      return {
        code: HttpStatus.NOT_FOUND,
        status: false,
        message: 'Danh mục không tồn tại',
        data: null
      }
    }
    const products = await this.productModel
      .find({ ...search, category })
      .populate('category')
      .skip(skip)
      .limit(parseInt(pageRecord))
      .lean()
      .exec()
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

  async getProductsByCategoryRaw(category_id: string): Promise<Product[]> {
    const _id = new ObjectId(category_id)
    const products = await this.productModel.find({ category: _id }).lean().exec()
    products.forEach((product) => {
      product.thumbnail = addDomainToImage(product.thumbnail)
      product.images.forEach((image, index) => {
        product.images[index] = addDomainToImage(image)
      })
    })
    return products
  }

  async updateProduct(id: string, updateProductDto: UpdateProductDto): Promise<IResponse<Product>> {
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
    } = updateProductDto
    const currentProduct = await this.getProductById(id)
    if (!currentProduct) {
      return {
        code: HttpStatus.NOT_FOUND,
        status: false,
        message: 'Sản phẩm không tồn tại',
        data: null
      }
    }
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
    let category: Category = null
    if (category_id) {
      category = await this.categoryService.getCategoryById(category_id)
      if (!category) {
        return {
          status: false,
          message: 'Danh mục không tồn tại',
          data: null
        }
      }
    }
    currentProduct.title = title || currentProduct.title
    currentProduct.description = description || currentProduct.description
    currentProduct.og_description = og_description || currentProduct.og_description
    currentProduct.og_title = og_title || currentProduct.og_title
    currentProduct.friendly_price = friendly_price || currentProduct.friendly_price
    currentProduct.origin_price = origin_price || currentProduct.origin_price
    currentProduct.sku = sku || currentProduct.sku
    currentProduct.availability = availability || currentProduct.availability
    currentProduct.og_url = og_url || currentProduct.og_url
    currentProduct.thumbnail = thumbnail || currentProduct.thumbnail
    currentProduct.quantity = quantity || currentProduct.quantity
    currentProduct.images = [...currentProduct.images, ...images] || currentProduct.images
    currentProduct.category = category || currentProduct.category
    currentProduct.variant = variant || currentProduct.variant
    currentProduct.updated_at = new Date()
    try {
      await this.productModel.findByIdAndUpdate(id, currentProduct)
      return {
        status: true,
        message: 'Success',
        data: currentProduct
      }
    } catch (error) {
      return {
        status: false,
        message: error.message,
        data: null
      }
    }
  }

  async deleteProduct(id: string): Promise<IResponse<Product>> {
    const currentProduct = await this.getProductById(id)
    if (!currentProduct) {
      return {
        code: HttpStatus.NOT_ACCEPTABLE,
        status: false,
        message: 'Sản phẩm không tìm thấy',
        data: null
      }
    }
    const variant = await this.productModel.findOne({ variant: currentProduct._id }).lean()
    if (variant) {
      return {
        status: false,
        message: 'Sản phẩm này đang là biến thể của sản phẩm khác',
        data: null
      }
    }
    currentProduct.deleted_at = new Date()
    try {
      await this.productModel.findByIdAndUpdate(id, currentProduct)
      return {
        status: true,
        message: 'Success',
        data: currentProduct
      }
    } catch (error) {
      return {
        status: false,
        message: error.message,
        data: null
      }
    }
  }

  async getProductsOrigin(): Promise<IResponse<Product[]>> {
    const products = await this.productModel.find({ deleted_at: null, variant: null }).lean()
    products.forEach((product) => {
      product.thumbnail = addDomainToImage(product.thumbnail)
      product._id = product._id.toString()
      product.images.forEach((image, index) => {
        product.images[index] = addDomainToImage(image)
      })
    })
    return {
      status: true,
      message: 'Success',
      data: products
    }
  }

  async deleteImage(id: string, image: string): Promise<IResponse<Product>> {
    const currentProduct = await this.getProductById(id)
    if (!currentProduct) {
      return {
        code: HttpStatus.NOT_ACCEPTABLE,
        status: false,
        message: 'Sản phẩm không tìm thấy',
        data: null
      }
    }
    const index = currentProduct.images.findIndex((img) => img === image)
    if (index === -1) {
      return {
        code: HttpStatus.NOT_ACCEPTABLE,
        status: false,
        message: 'Ảnh không tồn tại',
        data: null
      }
    }
    deleteFile(image)
    currentProduct.images.splice(index, 1)
    try {
      await this.productModel.findByIdAndUpdate(id, currentProduct)
      return {
        status: true,
        message: 'Success',
        data: currentProduct
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
