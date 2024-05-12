import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument } from 'mongoose'

export type GroupDocument = HydratedDocument<Category>

@Schema({ toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class Category {
  _id?: string
  @Prop()
  name: string

  @Prop()
  description: string

  @Prop()
  sort: number

  @Prop({ type: mongoose.Schema.Types.ObjectId, default: null, ref: 'categories' })
  parent: Category

  @Prop({ type: [mongoose.Schema.Types.ObjectId], default: [] })
  children: Category[]

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

export const CategorySchema = SchemaFactory.createForClass(Category)
