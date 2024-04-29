import { Injectable } from '@nestjs/common'
import { Category } from './category.schema'
import { CreateCategoryDto } from './dto/index.dto'
import { IResponse, IResponsePagination } from '@define/response'
import { ObjectId } from 'mongodb'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { TFilterCategories } from './define'

@Injectable()
export class CategoryService {
  constructor(@InjectModel('categories') private readonly categoryModel: Model<Category>) {}

  async createCategory(categoryDto: CreateCategoryDto): Promise<IResponse<Category>> {
    const { name, description, parent_id } = categoryDto

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

    const newCategory = new this.categoryModel({ name, description, parent })
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
    }
    return {
      status: true,
      message: 'Success',
      data: categories
    }
  }
  async getCategories(query: TFilterCategories): Promise<IResponsePagination<Category>> {
    const currentPage = query.current_page || '1'
    const pageRecord = query.page_record || '10'
    const skip = (parseInt(currentPage) - 1) * parseInt(pageRecord)
    const search = query.name ? { name: { $regex: query.name, $options: 'i' } } : {}
    const categories: Category[] = await this.categoryModel
      .find({
        ...search,
        deleted_at: null
      })
      .skip(skip)
      .limit(parseInt(pageRecord))
      .lean()
      .exec()
    return {
      status: true,
      message: 'Success',
      data: {
        data: categories,
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
  async updateCategory(id: string, categoryDto: CreateCategoryDto): Promise<IResponse<Category>> {
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
    currentCategory.updated_at = new Date()
    try {
      const res = await this.categoryModel.findByIdAndUpdate(id, currentCategory)
      return {
        status: true,
        message: 'Success',
        data: res.toObject()
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
}
