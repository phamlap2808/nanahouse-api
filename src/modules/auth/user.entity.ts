import { Entity, Column, ObjectIdColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { v4 as uuidv4 } from 'uuid'

@Entity({ synchronize: true })
export class User {
  @ObjectIdColumn()
  id: string = uuidv4()

  @Column()
  name: string

  @Column()
  group_id: number

  @Column({ unique: true })
  phone_number: string

  @Column()
  email: string

  @Column()
  address: string

  @Column()
  password: string

  @Column('string', { nullable: true })
  token: string = null

  @Column({ nullable: true })
  reset_pass_secret_key: string

  @Column('boolean', { default: false })
  auth_status: boolean = false

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date

  @Column({ nullable: true })
  delete_at: Date
}
