import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { GroupService } from './group.service'
import { GroupController } from './group.controller'
import { AuthModule } from '@/modules/auth/auth.module'
import { Group } from './group.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Group]), AuthModule],
  providers: [GroupService],
  controllers: [GroupController],
  exports: [GroupService]
})
export class GroupModule {}
