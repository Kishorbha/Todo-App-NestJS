import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { Model, ResolveTimestamps, Document, Types } from 'mongoose'
import { Users, UsersDocument } from 'src/modules/users/entities/user.entity'

@Schema({ timestamps: true })
export class Tasks {
  @Prop({ type: String, required: true })
  desc: string

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Users.name,
    required: true,
  })
  userId: Types.ObjectId | UsersDocument

  @Prop({ type: Boolean, default: false })
  completed: boolean

  createdAt: Date
  updatedAt: Date
}

export const TasksSchema = SchemaFactory.createForClass(Tasks)
export type TasksDocument = Tasks &
  ResolveTimestamps<Document, { timestamps: true }>
export type TasksModel = Model<TasksDocument>
