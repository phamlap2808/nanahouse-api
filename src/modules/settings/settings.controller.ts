import { Controller, Get } from '@nestjs/common'
import { SettingsService } from './settings.service'
import { IResponse } from '@define/response'
import { PERMISSIONS } from '@/config/index'

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get('permission')
  getPermissions(): IResponse<typeof PERMISSIONS> {
    return this.settingsService.getPermissionKeys()
  }
}
