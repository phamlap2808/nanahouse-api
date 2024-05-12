import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { CategoryService } from './category.service'
import { Category } from './category.schema'
import { CreateCategoryDto, UpdateCategoryDto } from './dto/index.dto'
import { IResponse, IResponsePagination } from '@define/response'
import { CheckPermissionsDecorator } from '../group/permissions.guard'
import PERMISSION_KEYS from '@/config/permission-key'
import { TFilterCategories, ICategoryHome } from './define'
import { Public } from '@/common/decorator/public.decorator'

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @CheckPermissionsDecorator(PERMISSION_KEYS.category_management)
  getCategories(@Query() query: TFilterCategories): Promise<IResponsePagination<any>> {
    return this.categoryService.getCategories(query)
  }

  @Post()
  @CheckPermissionsDecorator(PERMISSION_KEYS.category_add)
  createCategory(@Body() createCategoryDto: CreateCategoryDto): Promise<IResponse<Category>> {
    return this.categoryService.createCategory(createCategoryDto)
  }

  @Get('/menu')
  @CheckPermissionsDecorator(PERMISSION_KEYS.category_menu)
  getCategoriesMenu(): Promise<IResponse<Category[]>> {
    return this.categoryService.getCategoriesMenu()
  }

  @Get('/all')
  getAllCategories(): Promise<IResponse<Category[]>> {
    return this.categoryService.getAllCategories()
  }

  @Public()
  @Get('/home')
  getCategoriesHome(): Promise<IResponse<ICategoryHome[]>> {
    return this.categoryService.getCategoryHome()
  }

  @Public()
  @Get('/:id')
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
