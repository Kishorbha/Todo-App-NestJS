import { Expose, Transform } from 'class-transformer'
import { Types } from 'mongoose'

export class TaskSerializer {
  @Expose()
  @Transform(({ obj }) => obj._id)
  id: Types.ObjectId
  @Expose()
  desc: string
  @Expose() completed: boolean
  @Expose() createdAt: number
}
