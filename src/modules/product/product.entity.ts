import { Column, CreateDateColumn, Entity, ManyToOne, ObjectId, ObjectIdColumn, UpdateDateColumn } from 'typeorm'
import { Transform } from 'class-transformer'
import { Category } from '@/modules/category/category.schema'

@Entity({ synchronize: true })
export class Product {
  @ObjectIdColumn()
  @Transform(({ value }) => (value ? value.toString() : value), { toPlainOnly: true })
  id: ObjectId

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

  @ManyToOne(() => Category)
  category: Category

  @ManyToOne(() => Product)
  variant: Product

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date

  @Column({ type: 'timestamp', nullable: true, default: null })
  deleted_at: Date
}
