import { Controller, Post, UseInterceptors, UploadedFile, Logger, BadRequestException } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { MulterMiddleware } from '@/middleware/multer.middleware'
import { ProductService } from '@/modules/product/product.service'
// import { IResponse } from '@define/response'
// import { CreateProductDto } from './dto/index.dto'
// import { Product } from '@/modules/product/product.entity'
// import { CheckPermissionsDecorator } from './permissions.guard'

@Controller('product')
export class ProductController {
  logger = new Logger('ProductController')
  constructor(
    private readonly productService: ProductService,
    private readonly multerMiddleware: MulterMiddleware
  ) {}

  @Post()
  @UseInterceptors(new MulterMiddleware().singleFile())
  createProduct(@UploadedFile() thumbnail: Express.Multer.File) {
    if (!thumbnail) {
      throw new BadRequestException('Thumbnail file is required')
    }
    this.logger.log('Thumbnail object:', thumbnail)
  }
}
