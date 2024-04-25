import { Module } from '@nestjs/common'
import { ProductController } from './product.controller'
import { ProductService } from './product.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Product } from './product.entity'
import { GroupModule } from '../group/group.module'
import { AuthModule } from '@/modules/auth/auth.module'

@Module({
  imports: [TypeOrmModule.forFeature([Product]), GroupModule, AuthModule],
  controllers: [ProductController],
  providers: [ProductService]
})
export class ProductModule {}
