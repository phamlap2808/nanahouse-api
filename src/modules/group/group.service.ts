import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { MongoRepository } from 'typeorm'
import { Group } from './group.entity'
import { IResponse } from '@define/response'
import { CreateGroupDto } from './dto/create-group.dto'

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

  async getGroups(): Promise<IResponse<Group[]>> {
    const groups: Group[] = await this.groupRepository.find({
      where: {
        name: { $regex: 'admin', $options: 'i' }
      }
    })
    return {
      status: true,
      message: 'Success',
      data: groups
    }
  }

  async getGroupById(id: string): Promise<IResponse<Group>> {
    const group = await this.groupRepository.findOne({ where: { id } })
    if (!group) {
      return {
        status: false,
        message: 'Group not found',
        data: null
      }
    }
    return {
      status: true,
      message: 'Success',
      data: group
    }
  }
}
