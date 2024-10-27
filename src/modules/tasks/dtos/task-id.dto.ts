import { IsMongoId } from 'class-validator'

export class TaskIdDto {
  @IsMongoId()
  taskId: string
}
