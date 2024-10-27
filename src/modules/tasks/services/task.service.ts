import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common'
import { TaskRepository } from '../repositories/task.repository'
import { FilterQuery, Types } from 'mongoose'
import { TasksDocument } from '../entities/task.entity'
import { UsersDocument } from 'src/modules/users/entities/user.entity'
import { UpdateTaskDto } from '../dtos/update-task.dto'
import { TASK } from 'src/constants/task.constant'
import { escSpecialChars } from 'src/utils/escSpecialChars'
import { TankListDto } from '../dtos/tank-list.dto'
import { CreateTaskDto } from '../dtos/create-task.dto'

@Injectable()
export class TaskService {
  constructor(private readonly taskRepo: TaskRepository) {}

  async getAll(query: TankListDto, user: UsersDocument) {
    const { q } = query
    const filter: FilterQuery<TasksDocument> = { userId: user._id }
    if (q) filter.name = new RegExp(escSpecialChars(q), 'i')

    const [total, results] = await Promise.all([
      this.taskRepo.countDocuments(filter),
      this.taskRepo.aggregateAll(filter, query),
    ])
    return { total, results }
  }

  async create(user: UsersDocument, body: CreateTaskDto) {
    const newDoc = await this.taskRepo.new({ ...body, userId: user._id }).save()
    if (!newDoc)
      throw new HttpException(
        TASK.systemError,
        HttpStatus.INTERNAL_SERVER_ERROR,
      )

    return newDoc
  }

  async update(taskId: Types.ObjectId | string, body: UpdateTaskDto) {
    const updateDoc = await this.taskRepo.findByIdAndUpdate(taskId, body, {
      new: true,
    })
    if (!updateDoc) throw new BadRequestException(TASK.notFound)
    return updateDoc
  }

  async delete(taskId: Types.ObjectId | string, user: UsersDocument) {
    const deleteDoc = await this.taskRepo.findOneAndDelete({
      _id: taskId,
      userId: user._id,
    })

    return deleteDoc
  }
}
