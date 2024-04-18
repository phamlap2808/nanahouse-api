import { Controller, Get, Post, Body } from '@nestjs/common'
import { GroupService } from './group.service'
import { CreateGroupDto } from './dto/index.dto'
import { IResponse } from '@define/response'
import { Group } from '@/modules/group/group.entity'

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}
  @Get()
  list(): Promise<IResponse<Group[]>> {
    return this.groupService.getGroups()
  }

  @Post()
  create(@Body() createGroupDto: CreateGroupDto): Promise<IResponse<Group>> {
    return this.groupService.createGroup(createGroupDto)
  }
}
