import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { PERMISSION_KEYS } from '@/config/index'
import { GroupService } from './group.service' // adjust the path to your actual GroupService location

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private groupService: GroupService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSION_KEYS, [
      context.getHandler(),
      context.getClass()
    ])
    if (!requiredPermissions) {
      return true
    }
    const { user } = context.switchToHttp().getRequest()
    const group = await this.groupService.getGroupById(user.group_id)
    if (group.isAdmin) {
      return true
    }
    return requiredPermissions.some((permission) => group.permissions?.includes(permission))
  }
}
