import { Entity, ObjectIdColumn, Column, CreateDateColumn, UpdateDateColumn, ObjectId } from 'typeorm'
import { Transform } from 'class-transformer'

@Entity({ synchronize: true })
export class Group {
  @ObjectIdColumn()
  @Transform(({ value }) => value.toString(), { toPlainOnly: true })
  id: ObjectId

  @Column({ unique: true })
  name: string

  @Column()
  permissions: string[]

  @Column('boolean', { default: false })
  isAdmin: boolean = false

  @Column()
  description: string

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date

  @Column({ nullable: true })
  deleted_at: Date
}
