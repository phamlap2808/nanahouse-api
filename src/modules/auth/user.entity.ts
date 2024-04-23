import { Entity, Column, ObjectIdColumn, CreateDateColumn, UpdateDateColumn, ObjectId } from 'typeorm'
import { Transform } from 'class-transformer'

@Entity({ synchronize: true })
export class User {
  @ObjectIdColumn()
  @Transform(({ value }) => value.toString(), { toPlainOnly: true })
  id: ObjectId

  @Column()
  name: string

  @Column('string', { nullable: true })
  group_id: string = null

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
  deleted_at: Date
}
