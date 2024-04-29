import { Module } from '@nestjs/common'
import { CategoryController } from './category.controller'
import { CategoryService } from './category.service'
import { GroupModule } from '../group/group.module'
import { CategorySchema } from '../category/category.schema'
import { MongooseModule } from '@nestjs/mongoose'

@Module({
  imports: [GroupModule, MongooseModule.forFeature([{ name: 'categories', schema: CategorySchema }])],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService]
})
export class CategoryModule {}
