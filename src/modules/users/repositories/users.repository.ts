import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { MongooseBaseRepo } from 'src/utils/mongoose-base.repo'
import { Users, UsersDocument, UsersModel } from '../entities/user.entity'

@Injectable()
export class UsersRepository extends MongooseBaseRepo<UsersDocument> {
  constructor(
    @InjectModel(Users.name)
    private userModel: UsersModel,
  ) {
    super(userModel)
  }
}
