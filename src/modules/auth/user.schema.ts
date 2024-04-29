import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'
import { Group } from '@/modules/group/group.schema'

@Schema({ toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class User {
  _id?: string
  @Prop()
  name: string

  @Prop({ type: mongoose.Schema.Types.ObjectId, default: null, ref: 'groups' })
  group: Group

  @Prop({ unique: true })
  phone_number: string

  @Prop()
  email: string

  @Prop()
  address: string

  @Prop()
  password: string

  @Prop({ type: String, default: null })
  token: string

  @Prop({ default: null })
  reset_pass_secret_key: string

  @Prop({ default: false })
  auth_status: boolean

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

export const UserSchema = SchemaFactory.createForClass(User)
