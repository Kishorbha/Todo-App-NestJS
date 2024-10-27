import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Model, ResolveTimestamps, Document } from 'mongoose'

@Schema({ timestamps: true })
export class Users {
  @Prop({ type: String, trim: true })
  fullName: string

  @Prop({ type: String, required: true, unique: true, trim: true })
  email: string

  @Prop({ type: String, required: true })
  password: string
}

export const UsersSchema = SchemaFactory.createForClass(Users)
export type UsersDocument = Users &
  ResolveTimestamps<Document, { timestamps: true }>
export type UsersModel = Model<UsersDocument>
