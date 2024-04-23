import { Controller, Get, Post, Body, Query, Put, Param, Delete } from '@nestjs/common'
import { GroupService } from './group.service'
import { CreateGroupDto, UpdateGroupDto } from './dto/index.dto'
import { IResponse, IResponsePagination } from '@define/response'
import { Group } from '@/modules/group/group.entity'
import { TFilterGroup } from '@/modules/group/define'
import { CheckPermissionsDecorator } from './permissions.guard'
import PERMISSION_KEYS from '@/config/permission-key'

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}
  @Get()
  @CheckPermissionsDecorator(PERMISSION_KEYS.settings_group_management)
  listGroup(@Query() query: TFilterGroup): Promise<IResponsePagination<Group>> {
    return this.groupService.getGroups(query)
  }

  @Get('/:id')
  @CheckPermissionsDecorator(PERMISSION_KEYS.settings_group_detail)
  getGroup(@Param('id') id: string): Promise<IResponse<Group>> {
    return this.groupService.getGroup(id)
  }

  @Post()
  @CheckPermissionsDecorator(PERMISSION_KEYS.settings_group_add)
  createGroup(@Body() createGroupDto: CreateGroupDto): Promise<IResponse<Group>> {
    return this.groupService.createGroup(createGroupDto)
  }

  @Put('/:id')
  @CheckPermissionsDecorator(PERMISSION_KEYS.settings_group_edit)
  updateGroup(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto): Promise<IResponse<Group>> {
    return this.groupService.updateGroup(id, updateGroupDto)
  }

  @Delete('/:id')
  @CheckPermissionsDecorator(PERMISSION_KEYS.settings_group_delete)
  deleteGroup(@Param('id') id: string): Promise<IResponse<Group>> {
    return this.groupService.deleteGroup(id)
  }
}
