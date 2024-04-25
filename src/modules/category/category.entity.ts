import {
  Entity,
  Column,
  ObjectIdColumn,
  ManyToOne,
  OneToMany,
  ObjectId,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm'
import { Transform } from 'class-transformer'

@Entity({ synchronize: true })
export class Category {
  @ObjectIdColumn()
  @Transform(({ value }) => value.toString(), { toPlainOnly: true })
  id: ObjectId

  @Column()
  name: string

  @Column()
  description: string

  @Column('number', { nullable: true })
  sort: number

  @ManyToOne(() => Category, (category) => category.children)
  parent: Category

  @OneToMany(() => Category, (category) => category.parent)
  children: Category[]

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date

  @Column({ nullable: true })
  deleted_at: Date
}
