import { Injectable, Inject, forwardRef } from '@nestjs/common'
import { Category } from './category.schema'
import { CreateCategoryDto, UpdateCategoryDto } from './dto/index.dto'
import { IResponse, IResponsePagination } from '@define/response'
import { ObjectId } from 'mongodb'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { TFilterCategories, ICategoryHome } from './define'
import { ProductService } from '../product/product.service'

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel('categories') private readonly categoryModel: Model<Category>,
    @Inject(forwardRef(() => ProductService)) private readonly productService: ProductService
  ) {}

  async createCategory(categoryDto: CreateCategoryDto): Promise<IResponse<Category>> {
    const { name, description, parent_id, sort } = categoryDto

    let parent: Category = null
    if (parent_id) {
      parent = await this.getCategoryById(parent_id)
      if (!parent) {
        return {
          status: false,
          message: 'Danh mục cha không tồn tại',
          data: null
        }
      }
    }

    const newCategory = new this.categoryModel({ name, description, parent, sort })
    try {
      await newCategory.save()
      return {
        status: true,
        message: 'Success',
        data: newCategory.toObject()
      }
    } catch (error) {
      return {
        status: false,
        message: error.message,
        data: null
      }
    }
  }
  async getCategoryById(id: string): Promise<Category> {
    const _id = new ObjectId(id)
    const category = await this.categoryModel.findOne({ _id }).lean()
    if (!category) {
      return null
    }
    if (category.deleted_at) {
      return null
    }
    return category
  }
  async getCategoriesMenu(): Promise<IResponse<Category[]>> {
    const categories = await this.categoryModel.find({ deleted_at: null, parent: null }).lean()
    for (const category of categories) {
      category.children = await this.loadChildren(category)
      category._id = category._id.toString()
    }
    return {
      status: true,
      message: 'Success',
      data: categories
    }
  }
  async getCategories(query: TFilterCategories): Promise<IResponsePagination<any>> {
    const currentPage = query.current_page || '1'
    const pageRecord = query.page_record || '10'
    const skip = (parseInt(currentPage) - 1) * parseInt(pageRecord)
    const search = query.name ? { name: { $regex: query.name, $options: 'i' } } : {}
    let queryDB: any = { ...search, deleted_at: null }
    if (query.home) {
      queryDB = { ...queryDB, sort: { $ne: null } }
    }

    const categories: Category[] = query.home
      ? await this.categoryModel.find(queryDB).skip(skip).limit(parseInt(pageRecord)).populate('parent').lean().exec()
      : await this.categoryModel
          .find(queryDB)
          .sort({ sort: 1 })
          .skip(skip)
          .limit(parseInt(pageRecord))
          .populate('parent')
          .lean()
          .exec()
    const categoriesWithIdAsString = categories.map((category) => ({
      ...category,
      _id: category._id.toString(),
      parent: category.parent ? category.parent : null
    }))
    categoriesWithIdAsString.forEach((category) => {
      if (category.parent) {
        category.parent._id = category.parent._id.toString()
      }
    })
    return {
      status: true,
      message: 'Success',
      data: {
        data: categoriesWithIdAsString,
        total_page: Math.ceil(categories.length / parseInt(pageRecord)),
        total_page_record: parseInt(pageRecord),
        total_record: categories.length,
        current_page: parseInt(currentPage)
      }
    }
  }

  async loadChildren(parent: Category): Promise<Category[]> {
    const categories = await this.categoryModel.find({ parent, deleted_at: null }).lean()
    for (let i = 0; i < categories.length; i++) {
      categories[i].children = await this.loadChildren(categories[i])
      categories[i]._id = categories[i]._id.toString()
    }
    return categories
  }

  async getCategory(id: string): Promise<IResponse<Category>> {
    const category = await this.getCategoryById(id)
    if (!category) {
      return {
        status: false,
        message: 'Không tìm thấy danh mục',
        data: null
      }
    }
    return {
      status: true,
      message: 'Success',
      data: category
    }
  }
  async updateCategory(id: string, categoryDto: UpdateCategoryDto): Promise<IResponse<Category>> {
    const { name, description, parent_id } = categoryDto
    const currentCategory = await this.getCategoryById(id)
    if (!currentCategory) {
      return {
        status: false,
        message: 'Danh mục không tồn tại',
        data: null
      }
    }
    let parent: Category = null
    if (parent_id) {
      parent = await this.getCategoryById(parent_id)
      if (!parent) {
        return {
          status: false,
          message: 'Danh mục cha không tồn tại',
          data: null
        }
      }
    }
    currentCategory.name = name || currentCategory.name
    currentCategory.description = description || currentCategory.description
    currentCategory.parent = parent || currentCategory.parent
    currentCategory.sort = categoryDto.sort || currentCategory.sort
    currentCategory.updated_at = new Date()
    try {
      await this.categoryModel.findByIdAndUpdate(id, currentCategory)
      return {
        status: true,
        message: 'Success',
        data: currentCategory
      }
    } catch (error) {
      return {
        status: false,
        message: error.message,
        data: null
      }
    }
  }
  async deleteCategory(id: string): Promise<IResponse<Category>> {
    const currentCategory = await this.getCategoryById(id)
    if (!currentCategory) {
      return {
        status: false,
        message: 'Danh mục không tìm thấy',
        data: null
      }
    }
    currentCategory.deleted_at = new Date()
    try {
      await this.categoryModel.findByIdAndUpdate(id, currentCategory)
      return {
        status: true,
        message: 'Success',
        data: currentCategory
      }
    } catch (error) {
      return {
        status: false,
        message: error.message,
        data: null
      }
    }
  }
  async getCategoryHome(): Promise<IResponse<ICategoryHome[]>> {
    const categories = await this.categoryModel
      .find({ deleted_at: null, sort: { $ne: null } })
      .sort({ sort: 1 })
      .lean()
    const categoriesWithProducts = await Promise.all(
      categories.map(async (category) => {
        const products = await this.productService.getProductsByCategoryRaw(category._id)
        return { ...category, products }
      })
    )
    categoriesWithProducts.map((category) => {
      category._id = category._id.toString()
      category.products.map((product) => {
        product._id = product._id.toString()
      })
    })
    return {
      status: true,
      message: 'Success',
      data: categoriesWithProducts
    }
  }
  async getAllCategories(): Promise<IResponse<Category[] | null>> {
    const categories = await this.categoryModel.find({ deleted_at: null }).populate('parent').lean()
    categories.map((category) => {
      category._id = category._id.toString()
      category.parent ? (category.parent._id = category.parent._id.toString()) : null
    })
    return {
      status: true,
      message: 'Success',
      data: categories
    }
  }
}
