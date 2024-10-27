import { IsNotEmpty } from 'class-validator'

export class CreateTaskDto {
  @IsNotEmpty()
  desc: string
}
