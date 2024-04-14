import { Injectable } from '@nestjs/common'
import { IResponse } from '@define/response'
import { PERMISSIONS } from '@/config/index'

@Injectable()
export class SettingsService {
  getPermissionKeys(): IResponse<typeof PERMISSIONS> {
    return {
      status: true,
      message: 'Success',
      data: PERMISSIONS
    }
  }
}
