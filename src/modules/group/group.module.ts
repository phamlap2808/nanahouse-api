import { Module } from '@nestjs/common'
import { GroupService } from './group.service'
import { GroupController } from './group.controller'
import { AuthModule } from '@/modules/auth/auth.module'
import { MongooseModule } from '@nestjs/mongoose'
import { GroupSchema } from './group.schema'

@Module({
  imports: [AuthModule, MongooseModule.forFeature([{ name: 'groups', schema: GroupSchema }])],
  providers: [GroupService],
  controllers: [GroupController],
  exports: [GroupService]
})
export class GroupModule {}
