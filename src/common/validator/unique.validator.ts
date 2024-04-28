import { Injectable } from '@nestjs/common'
import { InjectConnection } from '@nestjs/mongoose'
import {
  registerDecorator,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator'
import { Connection, Model } from 'mongoose'

@Injectable()
@ValidatorConstraint({ async: true })
export class IsUniqueConstraint implements ValidatorConstraintInterface {
  constructor(@InjectConnection() private connection: Connection) {}

  async validate(value: any, args: ValidationArguments) {
    const [model, field] = args.constraints
    const repository: Model<any> = this.connection.model(model)

    const result = await repository.findOne({ [field]: value })
    return !result
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} already exists`
  }
}

export function isUnique(modelName: string, propertyName: string, additionalQuery?: object) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isUnique',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [modelName, propertyName, additionalQuery],
      validator: IsUniqueConstraint
    })
  }
}
