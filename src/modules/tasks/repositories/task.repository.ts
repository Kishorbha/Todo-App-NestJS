import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model, PipelineStage } from 'mongoose'
import { MongooseBaseRepo } from 'src/utils/mongoose-base.repo'
import { Tasks, TasksDocument } from '../entities/task.entity'
import { PaginateDto } from 'src/dto/paginate.dto'

@Injectable()
export class TaskRepository extends MongooseBaseRepo<TasksDocument> {
  constructor(
    @InjectModel(Tasks.name)
    taskModel: Model<TasksDocument>,
  ) {
    super(taskModel)
  }

  async aggregateAll(
    filter: FilterQuery<Tasks>,
    query: PaginateDto,
  ): Promise<Tasks[]> {
    const { limit, skip, sortBy, sortOrder } = query

    const dotProps = this.queryToDotProp(query)
    const project = dotProps.length
      ? { $project: this.dotPropToProject(query, dotProps) }
      : null
    const stages: PipelineStage[] = [
      { $match: filter },
      { $sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 } },
      { $skip: skip },
      { $limit: limit },
    ]

    if (project) stages.push(project)
    return this.aggregate(stages)
  }
}
