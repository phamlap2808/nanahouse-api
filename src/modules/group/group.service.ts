import { HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { MongoRepository } from 'typeorm'
import { ObjectId } from 'mongodb'
import { Group } from './group.entity'
import { IResponse, IResponsePagination } from '@define/response'
import { CreateGroupDto, UpdateGroupDto } from './dto/index.dto'
import { TFilterGroup } from '@/modules/group/define'

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: MongoRepository<Group>
  ) {}

  async createGroup(group: CreateGroupDto): Promise<IResponse<Group>> {
    const { name, description, permissions } = group
    const newGroup = this.groupRepository.create({ name, description, permissions })
    try {
      await this.groupRepository.save(newGroup)
      return {
        status: true,
        message: 'Success',
        data: newGroup
      }
    } catch (error) {
      return {
        status: false,
        message: error.message,
        data: null
      }
    }
  }

  async getGroups(query: TFilterGroup): Promise<IResponsePagination<Group>> {
    const currentPage = query.current_page || '1'
    const pageRecord = query.page_record || '10'
    const skip = (parseInt(currentPage) - 1) * parseInt(pageRecord)
    const search = query.name ? { name: { $regex: query.name, $options: 'i' } } : {}
    const groups: Group[] = await this.groupRepository.find({
      where: {
        ...search,
        deleted_at: null
      },
      skip,
      take: parseInt(pageRecord)
    })
    return {
      status: true,
      message: 'Success',
      data: {
        data: groups,
        total_page: Math.ceil(groups.length / parseInt(pageRecord)),
        total_page_record: parseInt(pageRecord),
        total_record: groups.length,
        current_page: parseInt(currentPage)
      }
    }
  }

  async getGroupById(id: string): Promise<Group> {
    const _id = new ObjectId(id)
    const group = await this.groupRepository.findOne({ where: { _id } })
    if (!group) {
      return null
    }
    if (group.deleted_at) {
      return null
    }
    return group
  }

  async getGroup(id: string): Promise<IResponse<Group>> {
    const group = await this.getGroupById(id)
    if (!group) {
      return {
        status: false,
        code: HttpStatus.NOT_FOUND,
        message: 'Không tìm thấy nhóm',
        data: null
      }
    }
    return {
      status: true,
      message: 'Success',
      data: group
    }
  }

  async updateGroup(id: string, group: UpdateGroupDto): Promise<IResponse<Group>> {
    const { name, description, isAdmin, permissions } = group
    const _id = new ObjectId(id)
    const currentGroup = await this.groupRepository.findOne({ where: { _id: _id } })
    if (!currentGroup) {
      return {
        status: false,
        code: HttpStatus.NOT_FOUND,
        message: 'Không tìm thấy nhóm cần cập nhật',
        data: null
      }
    }
    currentGroup.name = name || currentGroup.name
    currentGroup.description = description || currentGroup.description
    currentGroup.isAdmin = isAdmin || currentGroup.isAdmin
    currentGroup.permissions = permissions || currentGroup.permissions
    currentGroup.updated_at = new Date()
    try {
      await this.groupRepository.save(currentGroup)
      return {
        status: true,
        message: 'Success',
        data: currentGroup
      }
    } catch (error) {
      return {
        status: false,
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
        data: null
      }
    }
  }

  async deleteGroup(id: string): Promise<IResponse<Group>> {
    const group = await this.getGroupById(id)
    if (!group) {
      return {
        status: false,
        code: HttpStatus.NOT_FOUND,
        message: 'Không tìm thấy nhóm cần xóa',
        data: null
      }
    }
    group.deleted_at = new Date()
    try {
      await this.groupRepository.save(group)
      return {
        status: true,
        message: 'Success',
        data: group
      }
    } catch (error) {
      return {
        status: false,
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
        data: null
      }
    }
  }
}
