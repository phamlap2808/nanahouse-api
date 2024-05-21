import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseInterceptors
} from '@nestjs/common'
import { ProductService } from '@/modules/product/product.service'
import { FileFieldsInterceptor } from '@nestjs/platform-express'
import { createSingleFile, createMultipleFiles, removeDomainFromImage } from '@/common/helper/file.helper'
import { FilesFieldsValidationInterceptor } from '@/common/interceptors/image-validation.interceptors'
import { CreateProductDto, UpdateProductDto, DeleteProductImageDto } from './dto/index.dto'
import { Product } from '@/modules/product/product.schema'
import { IResponse, IResponsePagination } from '@define/response'
import { TFilterProduct } from './define'
import { Public } from '@/common/decorator/public.decorator'

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
    if (files?.images && files?.images?.length > 0) {
      createProductDto.images = createMultipleFiles(files.images)
    }
    return this.productService.createProduct(createProductDto)
  }

  @Get()
  @Public()
  listProduct(@Query() query: TFilterProduct): Promise<IResponsePagination<Product>> {
    return this.productService.getListProduct(query)
  }

  @Get('origin')
  listProductOrigin(): Promise<IResponse<Product[]>> {
    return this.productService.getProductsOrigin()
  }

  @Get('/:id')
  getProductDetail(@Param('id') id: string): Promise<IResponse<Product>> {
    return this.productService.getProductDetail(id)
  }

  @Put('/:id')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'thumbnail', maxCount: 1 },
      { name: 'images', maxCount: 5 }
    ]),
    new FilesFieldsValidationInterceptor()
  )
  updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles() files: { thumbnail?: Express.Multer.File[]; images?: Express.Multer.File[] }
  ): Promise<IResponse<Product>> {
    if (files?.thumbnail && files?.thumbnail?.length > 0) {
      updateProductDto.thumbnail = createSingleFile(files.thumbnail[0])
    }
    if (files?.images && files?.images?.length > 0) {
      updateProductDto.images = createMultipleFiles(files.images)
    }
    return this.productService.updateProduct(id, updateProductDto)
  }

  @Delete('/:id')
  deleteProduct(@Param('id') id: string): Promise<IResponse<Product>> {
    return this.productService.deleteProduct(id)
  }

  @Delete('/:id/image')
  deleteImage(@Param('id') id: string, @Body() deleteImageDto: DeleteProductImageDto): Promise<IResponse<Product>> {
    const imagePath = removeDomainFromImage(deleteImageDto.image)
    return this.productService.deleteImage(id, imagePath)
  }
}
