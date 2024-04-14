import { Controller, Get } from '@nestjs/common'

@Controller('group')
export class GroupController {
  @Get()
  list() {
    return 'List of groups'
  }
}
