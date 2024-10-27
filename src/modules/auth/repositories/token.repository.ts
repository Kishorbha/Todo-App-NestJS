import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { MongooseBaseRepo } from 'src/utils/mongoose-base.repo'
import { Tokens, TokensDocument } from '../entities/token.entity'

@Injectable()
export class TokensRepository extends MongooseBaseRepo<TokensDocument> {
  constructor(
    @InjectModel(Tokens.name)
    tokenModel: Model<TokensDocument>,
  ) {
    super(tokenModel)
  }
}
