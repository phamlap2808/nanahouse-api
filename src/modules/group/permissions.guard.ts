import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  applyDecorators,
  SetMetadata,
  UseGuards
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { User } from '@/modules/auth/user.entity'
import { Group } from '@/modules/group/group.entity'
import { GroupService } from '@/modules/group/group.service'

@Injectable()
export class CheckPermissions implements CanActivate {
  constructor(
    private reflector: Reflector,
    private groupService: GroupService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.get<string[]>('permissions', context.getHandler())
    if (!requiredPermissions) {
      return true
    }

    const request = context.switchToHttp().getRequest()
    const user: User = request.user

    const group: Group = await this.groupService.getGroupById(user.group_id)
    if (!group) {
      throw new ForbiddenException('You do not have permission to perform this action')
    }
    if (group.isAdmin) {
      return true
    }

    const hasPermission = requiredPermissions.some((permission) => group.permissions.includes(permission))
    if (!hasPermission) {
      throw new ForbiddenException('You do not have permission to perform this action')
    }

    return true
  }
}

export const CheckPermissionsDecorator = (...permissions: string[]) => {
  return applyDecorators(SetMetadata('permissions', permissions), UseGuards(CheckPermissions))
}
