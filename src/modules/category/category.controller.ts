import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { CategoryService } from './category.service'
import { Category } from './category.entity'
import { CreateCategoryDto, UpdateCategoryDto } from './dto/index.dto'
import { IResponse } from '@define/response'
import { CheckPermissionsDecorator } from '../group/permissions.guard'
import PERMISSION_KEYS from '@/config/permission-key'

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @CheckPermissionsDecorator(PERMISSION_KEYS.category_list)
  listCategory(): Promise<IResponse<Category[]>> {
    return this.categoryService.getCategories()
  }

  @Post()
  @CheckPermissionsDecorator(PERMISSION_KEYS.category_add)
  createCategory(@Body() createCategoryDto: CreateCategoryDto): Promise<IResponse<Category>> {
    return this.categoryService.createCategory(createCategoryDto)
  }

  @Get('/:id')
  @CheckPermissionsDecorator(PERMISSION_KEYS.category_detail)
  getCategory(@Param('id') id: string): Promise<IResponse<Category>> {
    return this.categoryService.getCategory(id)
  }

  @Put('/:id')
  @CheckPermissionsDecorator(PERMISSION_KEYS.category_edit)
  updateCategory(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto): Promise<IResponse<Category>> {
    return this.categoryService.updateCategory(id, updateCategoryDto)
  }

  @Delete('/:id')
  @CheckPermissionsDecorator(PERMISSION_KEYS.category_delete)
  deleteCategory(@Param('id') id: string): Promise<IResponse<Category>> {
    return this.categoryService.deleteCategory(id)
  }
}
