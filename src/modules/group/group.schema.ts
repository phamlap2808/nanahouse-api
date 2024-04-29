import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type GroupDocument = HydratedDocument<Group>

@Schema({ toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class Group {
  _id?: string
  @Prop({ unique: true })
  name: string

  @Prop([String])
  permissions: string[]

  @Prop({ default: false })
  isAdmin: boolean

  @Prop()
  description: string

  @Prop({ default: Date.now })
  created_at: Date

  @Prop({ default: Date.now })
  updated_at: Date

  @Prop({ default: null })
  deleted_at: Date

  get id() {
    return this._id.toString()
  }
}

export const GroupSchema = SchemaFactory.createForClass(Group)
