import { Module, forwardRef } from '@nestjs/common'
import { CategoryController } from './category.controller'
import { CategoryService } from './category.service'
import { GroupModule } from '../group/group.module'
import { CategorySchema } from '../category/category.schema'
import { MongooseModule } from '@nestjs/mongoose'
import { ProductModule } from '../product/product.module'
import { ProductSchema } from '../product/product.schema'

@Module({
  imports: [
    GroupModule,
    MongooseModule.forFeature([
      { name: 'categories', schema: CategorySchema },
      { name: 'products', schema: ProductSchema }
    ]),
    forwardRef(() => ProductModule)
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService]
})
export class CategoryModule {}
