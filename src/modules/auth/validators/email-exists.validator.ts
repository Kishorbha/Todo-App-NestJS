import { BadRequestException, Injectable } from '@nestjs/common'
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'
import { USER } from 'src/constants/user.constant'
import { UsersRepository } from 'src/modules/users/repositories/users.repository'

@ValidatorConstraint({ name: 'email', async: true })
@Injectable()
export class IsEmailExistsValidation implements ValidatorConstraintInterface {
  constructor(private readonly userRepo: UsersRepository) {}

  async validate(value: string): Promise<boolean> {
    const isEmailExists = await this.userRepo.findOne({ email: value })
    if (isEmailExists) {
      throw new BadRequestException(
        USER.emailAlreadyTaken.replace('Email', value),
      )
    } else {
      return true
    }
  }
}
