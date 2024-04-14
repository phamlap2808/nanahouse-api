import { Injectable } from '@nestjs/common'
import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator
} from 'class-validator'
import { EntityManager } from 'typeorm'

// decorator options interface
export type IsUniqeInterface = {
  tableName: string
  column: string
}

@ValidatorConstraint({ name: 'IsUniqueConstraint', async: true })
@Injectable()
export class IsUniqueConstraint implements ValidatorConstraintInterface {
  constructor(private readonly entityManager: EntityManager) {}
  async validate(value: any, args?: ValidationArguments): Promise<boolean> {
    // catch options from decorator
    const { tableName, column }: IsUniqeInterface = args.constraints[0]

    // database query check data is exists
    const dataExist = await this.entityManager.getMongoRepository(tableName).findOne({ [column]: value })
    return !dataExist
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    // return custom field message
    const field: string = validationArguments.property
    return `${field} Đã tồn tại trong hệ thống`
  }
}

// decorator function
export function isUnique(options: IsUniqeInterface, validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isUnique',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [options],
      validator: IsUniqueConstraint
    })
  }
}
