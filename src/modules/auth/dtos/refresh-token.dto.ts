import { IsNotEmpty } from 'class-validator'

export class TokenDto {
  @IsNotEmpty()
  resetToken: string
}
