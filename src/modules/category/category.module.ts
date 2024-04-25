import { Module } from '@nestjs/common'
import { CategoryController } from './category.controller'
import { CategoryService } from './category.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Category } from './category.entity'
import { GroupModule } from '../group/group.module'

@Module({
  imports: [TypeOrmModule.forFeature([Category]), GroupModule],
  controllers: [CategoryController],
  providers: [CategoryService]
})
export class CategoryModule {}
