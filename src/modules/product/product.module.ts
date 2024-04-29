import { Module } from '@nestjs/common'
import { ProductController } from './product.controller'
import { ProductService } from './product.service'
import { GroupModule } from '../group/group.module'
import { CategoryModule } from '../category/category.module'
import { AuthModule } from '@/modules/auth/auth.module'
import { MongooseModule } from '@nestjs/mongoose'
import { ProductSchema } from './product.schema'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'products', schema: ProductSchema }]),
    GroupModule,
    AuthModule,
    CategoryModule
  ],
  controllers: [ProductController],
  providers: [ProductService]
})
export class ProductModule {}
