import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { GroupService } from './group.service'
import { GroupController } from './group.controller'
import { AuthModule } from '@/modules/auth/auth.module'

@Module({
  imports: [TypeOrmModule.forFeature([]), AuthModule],
  providers: [GroupService],
  controllers: [GroupController]
})
export class GroupModule {}
