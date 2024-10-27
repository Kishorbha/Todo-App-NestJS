import {
  AggregateOptions,
  AnyObject,
  ClientSessionOptions,
  Document,
  InsertManyOptions,
  Model,
  MongooseBulkWriteOptions,
  PipelineStage,
  ProjectionType,
  QueryOptions,
  RootQuerySelector,
  UpdateQuery,
  UpdateWithAggregationPipeline,
} from 'mongoose'
import {
  BulkWriteOptions,
  AnyBulkWriteOperation,
  ChangeStreamOptions,
} from 'mongodb'
import { PopulateOptions } from 'mongoose'
import { PaginateDto } from 'src/dto/paginate.dto'

export class MongooseBaseRepo<T> {
  public readonly modelName: string
  constructor(private readonly model: Model<T>) {
    this.model = model
    this.modelName = model.modelName
  }

  new(doc?: Partial<T>, fields?: any, options?: boolean | AnyObject) {
    return new this.model(doc, fields, options)
  }

  aggregate(pipeline?: PipelineStage[], options?: AggregateOptions) {
    return this.model.aggregate(pipeline, options)
  }

  bulkSave(
    documents: Document<any, any, any>[],
    options?: BulkWriteOptions & {
      timestamps?: boolean
    },
  ) {
    return this.model.bulkSave(documents, options)
  }

  bulkWrite(
    writes: AnyBulkWriteOperation<
      // eslint-disable-next-line
      T extends Document<any, any, any> ? any : T extends {} ? T : any
    >[],
    options?: BulkWriteOptions & MongooseBulkWriteOptions,
  ) {
    return this.model.bulkWrite(writes, options)
  }

  countDocuments(
    filter?: Partial<T> & RootQuerySelector<T>,
    options?: QueryOptions<T>,
  ) {
    return this.model.countDocuments(filter, options)
  }

  deleteMany(
    filter?: Partial<T> & RootQuerySelector<T>,
    options?: QueryOptions<T>,
  ) {
    return this.model.deleteMany(filter, options)
  }

  deleteOne(
    filter?: Partial<T> & RootQuerySelector<T>,
    options?: QueryOptions<T>,
  ) {
    return this.model.deleteOne(filter, options)
  }

  estimatedDocumentCount(options?: QueryOptions<T>) {
    return this.model.estimatedDocumentCount(options)
  }

  exists(filter: Partial<T> & RootQuerySelector<T>) {
    return this.model.exists(filter)
  }

  find(
    filter: Partial<T> & RootQuerySelector<T>,
    projection?: ProjectionType<T>,
    options?: QueryOptions<T>,
  ) {
    return this.model.find(filter, projection, options)
  }

  findById(id: any, projection?: ProjectionType<T>, options?: QueryOptions<T>) {
    return this.model.findById(id, projection, options)
  }

  findByIdAndDelete(id?: any, options?: QueryOptions<T>) {
    return this.model.findByIdAndDelete(id, options)
  }

  findByIdAndUpdate(
    id?: any,
    update?: UpdateQuery<T>,
    options?: QueryOptions<T>,
  ) {
    return this.model.findByIdAndUpdate(id, update, options)
  }

  findOne(
    filter?: Partial<T> & RootQuerySelector<T>,
    projection?: ProjectionType<T>,
    options?: QueryOptions<T>,
  ) {
    return this.model.findOne(filter, projection, options)
  }

  findOneAndDelete(
    filter?: Partial<T> & RootQuerySelector<T>,
    options?: QueryOptions<T>,
  ) {
    return this.model.findOneAndDelete(filter, options)
  }

  findOneAndReplace(
    filter?: Partial<T> & RootQuerySelector<T>,
    replacement?: T | AnyObject,
    options?: QueryOptions<T>,
  ) {
    return this.model.findOneAndReplace(filter, replacement, options)
  }

  findOneAndUpdate(
    filter?: Partial<T> & RootQuerySelector<T>,
    update?: UpdateQuery<T>,
    options?: QueryOptions<T>,
  ) {
    return this.model.findOneAndUpdate(filter, update, options)
  }

  insertMany(docs: T[], options: InsertManyOptions & { lean: true }) {
    return this.model.insertMany(docs, options)
  }

  startSession(options?: ClientSessionOptions) {
    return this.model.startSession(options)
  }

  updateMany(
    filter?: Partial<T> & RootQuerySelector<T>,
    update?: UpdateWithAggregationPipeline | UpdateQuery<T>,
    options?: QueryOptions<T>,
  ) {
    return this.model.updateMany(filter, update, options)
  }

  updateOne(
    filter?: Partial<T> & RootQuerySelector<T>,
    update?: UpdateWithAggregationPipeline | UpdateQuery<T>,
    options?: QueryOptions<T>,
  ) {
    return this.model.updateOne(filter, update, options)
  }

  watch(
    pipeline?: Record<string, unknown>[],
    options?: ChangeStreamOptions & { hydrate?: boolean },
  ) {
    return this.model.watch(pipeline, options)
  }

  populate(docs: any[], options: string | PopulateOptions | PopulateOptions[]) {
    return this.model.populate(docs, options)
  }

  /**
   *
   * @param {string} query
   * @returns dot props object
   * @example 'total,limit,items(added_at,added_by,track(name,href,album(name,href))),field1,arr(1,2),name'
   */
  queryToDotProp(query: PaginateDto) {
    const { includeFields, excludeFields } = query
    const serialized = includeFields || excludeFields
    if (!serialized) return []
    const prefix = []
    const initialDotProps = []

    let index = 0
    let field = ''

    function newProp() {
      if (!field) return
      initialDotProps.push(
        prefix.length ? `${prefix.join('.')}.${field}` : field,
      )
      field = ''
    }

    /** loop over every chars and get the list of dot props */
    while (index < serialized.length) {
      const char = serialized[index]
      if (char === ' ') {
        // nothing
      } else if (char === '(') {
        prefix.push(field)
        field = ''
      } else if (char === ')') {
        newProp()
        prefix.pop()
      } else if (char === ',') {
        newProp()
      } else field += char
      index++
    }
    /** to get the last field */
    newProp()

    /** remove duplicate dot props, nested one will take the priority */
    const finalDotProps = []
    initialDotProps.forEach((k) => {
      const dup = initialDotProps.find((nestK) => nestK.startsWith(`${k}.`))
      if (!dup) finalDotProps.push(k)
    })
    return finalDotProps.sort()
  }

  dotPropToProject(query: PaginateDto, fields: string[]) {
    const { includeFields } = query
    const obj = {}
    fields.forEach((k) => (obj[k] = includeFields ? 1 : 0))
    return obj
  }

  /**
   *
   * @param query PaginateDto
   * @param fields array of strings
   * @returns null or object with key as string and value as boolean
   */
  shouldLookup<T extends string>(
    query: PaginateDto,
    dotProps: string[],
    lookupFields: T[] = [],
  ): { [K in T]: boolean } | null {
    const { includeFields, excludeFields } = query
    const context = includeFields ? false : true
    const obj = {} as { [K in T]: boolean }
    lookupFields.forEach((l) => (obj[l] = context))

    /**
     * 1. loop from dot props as prop
     *    a. loop over every lookupFields as l
     *       i. check if l starts with prop
     *    b. return if func was called for excludeFields
     *    c. split prop and loop over every nested prop
     *       i. join every split incrementally and check if it includes in lookupField
     */
    dotProps.forEach((prop) => {
      lookupFields.forEach((l) => l.startsWith(prop) && (obj[l] = !context))

      if (!includeFields && excludeFields) return
      const propSplit = prop.split('.')
      propSplit.forEach((f, index) => {
        const lookupStep = propSplit.slice(0, index + 1).join('.') as T
        if (lookupFields.includes(lookupStep)) obj[lookupStep] = !context
      })
    })

    return obj
  }
}
