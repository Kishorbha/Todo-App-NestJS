import { Transform } from 'class-transformer'
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'

enum SortOrder {
  asc = 'asc',
  desc = 'desc',
}

export class PaginateDto {
  @IsOptional()
  @Transform(({ value }) => +value)
  @IsNumber({}, { message: 'page must be number' })
  page?: number

  @IsOptional()
  @Transform(({ value }) => +value)
  @IsNumber({}, { message: 'limit must be number' })
  limit: number

  @IsOptional()
  @Transform(({ value }) => +value)
  skip: number

  @IsOptional()
  @IsString()
  sortBy?: string

  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: keyof typeof SortOrder

  @IsOptional()
  @IsString()
  includeFields?: string

  @IsOptional()
  @IsString()
  excludeFields?: string
}
