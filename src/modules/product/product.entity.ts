import { Column, CreateDateColumn, Entity, ObjectId, ObjectIdColumn, UpdateDateColumn } from 'typeorm'
import { Transform } from 'class-transformer'

@Entity({ synchronize: true })
export class Product {
  @ObjectIdColumn()
  @Transform(({ value }) => value.toString(), { toPlainOnly: true })
  id: ObjectId

  @ObjectIdColumn()
  @Transform(({ value }) => value.toString(), { toPlainOnly: true })
  category_id: ObjectId

  @Column()
  title: string

  @Column()
  sku: string

  @Column()
  description: string

  @Column()
  origin_price: number

  @Column()
  friendly_price: number

  @Column()
  quantity: number

  @Column()
  availability: number

  @Column()
  og_title: string

  @Column()
  og_description: string

  @Column()
  og_url: string

  @Column()
  thumbnail: string

  @Column()
  images: string[]

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date

  @Column({ nullable: true })
  deleted_at: Date
}
