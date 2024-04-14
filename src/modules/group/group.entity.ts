import { Entity, ObjectIdColumn, Column } from 'typeorm'
import { v4 as uuidv4 } from 'uuid'

@Entity({ synchronize: true })
export class Group {
  @ObjectIdColumn()
  id: string = uuidv4()

  @Column({ unique: true })
  name: string

  @Column()
  permissions: string[]

  @Column()
  isAdmin: boolean

  @Column()
  description: string

  @Column()
  createdBy: string = uuidv4()

  @Column()
  updatedBy: string = uuidv4()
}
