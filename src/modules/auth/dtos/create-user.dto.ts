import {
  IsEmail,
  IsNotEmpty,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator'
import { IsEmailExistsValidation } from '../validators/email-exists.validator'

export class CreateUserDto {
  @IsNotEmpty()
  fullName: string

  @IsEmail()
  @Validate(IsEmailExistsValidation)
  email: string

  @MinLength(8)
  @MaxLength(32)
  password: string
}
