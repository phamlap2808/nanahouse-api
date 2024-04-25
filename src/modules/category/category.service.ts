import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { MongoRepository } from 'typeorm'
import { Category } from './category.entity'
import { CreateCategoryDto } from './dto/index.dto'
import { IResponse } from '@define/response'
import { ObjectId } from 'mongodb'

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: MongoRepository<Category>
  ) {}

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

    const newCategory = this.categoryRepository.create({ name, description, parent })
    try {
      await this.categoryRepository.save(newCategory)
      return {
        status: true,
        message: 'Success',
        data: newCategory
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
    const category = await this.categoryRepository.findOne({ where: { _id } })
    if (!category) {
      return null
    }
    if (category.deleted_at) {
      return null
    }
    return category
  }
  async getCategories(): Promise<IResponse<Category[]>> {
    const categories = await this.categoryRepository.find({ where: { deleted_at: null, parent: null } })
    for (const category of categories) {
      await this.loadChildren(category)
    }
    return {
      status: true,
      message: 'Success',
      data: categories
    }
  }
  async loadChildren(category: Category): Promise<void> {
    category.children = await this.categoryRepository.find({ where: { parent: category } })
    for (const child of category.children) {
      await this.loadChildren(child)
    }
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
      await this.categoryRepository.save(currentCategory)
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
      await this.categoryRepository.save(currentCategory)
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
