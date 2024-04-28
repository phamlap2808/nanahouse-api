import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type GroupDocument = HydratedDocument<Group>

@Schema()
export class Group {
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
}

export const GroupSchema = SchemaFactory.createForClass(Group)
