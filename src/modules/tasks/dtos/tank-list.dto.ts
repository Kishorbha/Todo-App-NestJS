import { IsOptional, IsString } from 'class-validator'
import { PaginateDto } from 'src/dto/paginate.dto'

export class TankListDto extends PaginateDto {
  @IsOptional()
  @IsString()
  q?: string
}
