import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument } from 'mongoose'
import { Category } from '../category/category.schema'

export type GroupDocument = HydratedDocument<Product>

@Schema({ toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class Product {
  _id?: string
  @Prop()
  title: string

  @Prop()
  sku: string

  @Prop()
  description: string

  @Prop()
  origin_price: number

  @Prop()
  friendly_price: number

  @Prop()
  quantity: number

  @Prop()
  availability: number

  @Prop()
  og_title: string

  @Prop()
  og_description: string

  @Prop()
  og_url: string

  @Prop()
  thumbnail: string

  @Prop()
  images: string[]

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'categories' })
  category: Category

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'products' })
  variant: Product

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

export const ProductSchema = SchemaFactory.createForClass(Product)
