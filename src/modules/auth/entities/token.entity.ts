import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { Document, Types } from 'mongoose'
import { Users, UsersDocument } from 'src/modules/users/entities/user.entity'

export type TokensDocument = Tokens & Document

@Schema({ timestamps: true })
export class Tokens {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Users.name,
    required: true,
  })
  userId: Types.ObjectId | UsersDocument

  @Prop({ type: String, index: true })
  token: string

  @Prop({ type: Date, default: null })
  expireAt: Date
}

export const TokensSchema = SchemaFactory.createForClass(Tokens).index(
  { expireAt: 1 },
  { expireAfterSeconds: 0 },
)
