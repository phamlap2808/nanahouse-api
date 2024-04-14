import { Controller, Get, Post } from '@nestjs/common'

@Controller('group')
export class GroupController {
  @Get()
  list() {
    return 'List of groups'
  }

  @Post()
  create() {
    return 'Create group'
  }
}
