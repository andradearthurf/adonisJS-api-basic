import Message from 'App/Models/Core/Message'
import { schema, validator, TypedSchema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import { LucidModel } from '@ioc:Adonis/Lucid/Orm'

export default abstract class Service {
  protected model: LucidModel
  protected preloadRelations: string[] = []

  constructor(model: LucidModel) {
    this.model = model
  }

  public async all(columns: string[] = ['*']): Promise<Message> {
    try {
      const query = this.model.query().select(columns)
      const models = await this.applyPreloads(query)
      return Message.success('Items retrieved successfully', models)
    } catch (error) {
      return Message.error('List could not be retrieved', null, error.message)
    }
  }

  public async find(id: number): Promise<Message> {
    try {
      const query = this.model.query().where('id', id).limit(1)

      const model = await this.applyPreloads(query)
      return Message.success('Item retrieved successfully', model[0] ? model[0] : model)
    } catch (error) {
      return Message.error('Item could not be retrieved', null, error.message)
    }
  }

  public async findBy(criteria: Record<string, any>): Promise<Message> {
    try {
      const query = this.model.query().where(criteria)

      const models = await this.applyPreloads(query)
      return Message.success('Items retrieved successfully', models)
    } catch (error) {
      return Message.error('List could not be retrieved', null, error.message)
    }
  }

  public async findOneBy(criteria: Record<string, any>): Promise<Message> {
    try {
      const query = this.model.query().where(criteria).limit(1)

      const model = await this.applyPreloads(query)

      return Message.success('Item retrieved successfully', model[0])
    } catch (error) {
      return Message.error('Item could not be retrieved', null, error.message)
    }
  }

  public async findByRaw(queryString: string, bindings: any[]): Promise<Message> {
    try {
      const query = this.model.query().whereRaw(queryString, bindings)
      const models = await this.applyPreloads(query)
      return Message.success('Items retrieved successfully', models)
    } catch (error) {
      return Message.error('List could not be retrieved', null, error.message)
    }
  }

  public async create(data: Record<string, any>): Promise<Message> {
    try {
      const model = await this.model.create(data)
      return Message.success('Item created successfully', model)
    } catch (error) {
      return Message.error('Item could not be created', null, error.message)
    }
  }

  public async update(data: Record<string, any>, id: number | string): Promise<Message> {
    try {
      const model = await this.model.findOrFail(id)
      model.merge(data)
      await model.save()
      return Message.success('Item updated successfully', model)
    } catch (error) {
      return Message.error('Item could not be updated', null, error.message)
    }
  }

  public async delete(id: number): Promise<Message> {
    try {
      const model = await this.model.findOrFail(id)
      await model.delete()
      return Message.success('Item deleted successfully', null)
    } catch (error) {
      return Message.error('Item could not be deleted', null, error.message)
    }
  }

  public with(...relations: string[]): this {
    this.preloadRelations = relations
    return this
  }

  protected applyPreloads(query: any): any {
    if (this.preloadRelations.length > 0) {
      for (const relation of this.preloadRelations) {
        query.preload(relation)
      }
    }
    this.preloadRelations = []
    return query
  }

  protected async validate(data: Record<string, any>, id?: any): Promise<Message> {
    const validationSchema = this.rules(id)
    const customMessages = this.messages()

    try {
      schema.create(validationSchema)
      if (validationSchema) {
        await validator.validate({
          schema: schema.create(validationSchema),
          data: data,
          messages: customMessages,
        })
      }
      return Message.success('Success', null)
    } catch (error) {
      return Message.error('Validation failed', null, error.messages)
    }
  }

  public rules(id: any): TypedSchema {
    if (id) {
      //pass
    }
    return {}
  }

  public messages(): CustomMessages {
    return {}
  }
}
