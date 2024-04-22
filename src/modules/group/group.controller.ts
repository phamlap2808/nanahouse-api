import { Controller, Get, Post, Body, Query, Put, Param, Delete } from '@nestjs/common'
import { GroupService } from './group.service'
import { CreateGroupDto, UpdateGroupDto } from './dto/index.dto'
import { IResponse, IResponsePagination } from '@define/response'
import { Group } from '@/modules/group/group.entity'
import { TFilterGroup } from '@/modules/group/define'

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}
  @Get()
  listGroup(@Query() query: TFilterGroup): Promise<IResponsePagination<Group>> {
    return this.groupService.getGroups(query)
  }

  @Get('/:id')
  getGroup(@Param('id') id: string): Promise<IResponse<Group>> {
    return this.groupService.getGroup(id)
  }

  @Post()
  createGroup(@Body() createGroupDto: CreateGroupDto): Promise<IResponse<Group>> {
    return this.groupService.createGroup(createGroupDto)
  }

  @Put('/:id')
  updateGroup(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto): Promise<IResponse<Group>> {
    return this.groupService.updateGroup(id, updateGroupDto)
  }

  @Delete('/:id')
  deleteGroup(@Param('id') id: string): Promise<IResponse<Group>> {
    return this.groupService.deleteGroup(id)
  }
}
