import { Entity, ObjectIdColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { v4 as uuidv4 } from 'uuid'

@Entity({ synchronize: true })
export class Group {
  @ObjectIdColumn()
  id: string = uuidv4()

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
  delete_at: Date
}
