import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors
} from '@nestjs/common'
import { ProductService } from '@/modules/product/product.service'
import { FileFieldsInterceptor } from '@nestjs/platform-express'
import { createSingleFile, createMultipleFiles } from '@/common/helper/file.helper'
import { FilesFieldsValidationInterceptor } from '@/common/interceptors/image-validation.interceptors'
import { CreateProductDto } from './dto/index.dto'
import { Product } from '@/modules/product/product.schema'
import { IResponse, IResponsePagination } from '@define/response'
import { TFilterProduct } from './define'

// import { CheckPermissionsDecorator } from './permissions.guard'

@Controller('product')
export class ProductController {
  logger = new Logger('ProductController')
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'thumbnail', maxCount: 1 },
      { name: 'images', maxCount: 5 }
    ]),
    new FilesFieldsValidationInterceptor()
  )
  createProduct(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() files: { thumbnail?: Express.Multer.File[]; images?: Express.Multer.File[] }
  ): Promise<IResponse<Product>> {
    if (!files.thumbnail) {
      throw new HttpException('Thumbnail is required', HttpStatus.UNPROCESSABLE_ENTITY)
    }
    createProductDto.thumbnail = createSingleFile(files.thumbnail[0])
    if (files.images && files.images.length > 0) {
      createProductDto.images = createMultipleFiles(files.images)
    }
    return this.productService.createProduct(createProductDto)
  }

  @Get()
  listProduct(@Query() query: TFilterProduct): Promise<IResponsePagination<Product>> {
    return this.productService.getListProduct(query)
  }
}
