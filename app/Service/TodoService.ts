import Todo from 'App/Models/Todo'
import Service from './Base/Service'
import Message from 'App/Models/Core/Message'

export default class TodoService extends Service {
  constructor() {
    super(Todo)
  }

  public async createTodo(data: any): Promise<Message> {
    try {
      let message = await this.validate(data)
      if (!message.isSuccess()) {
        return message
      }

      const todoData = {
        title: data.title,
        desc: data.desc,
      }

      message = await this.create(todoData)

      if (!message.isSuccess()) {
        return message
      }

      const todo = message.getData()

      return Message.success('All registered successfully!', todo)
    } catch (error) {
      return Message.error('It was not possible to register everything.', null, error.message)
    }
  }

  public async updateTodo(data: any) {
    try {
      let message = await this.validate(data, data.id)
      if (!message.isSuccess()) {
        return message
      }
      message = await this.find(data.id)

      if (!message.isSuccess()) {
        return message
      }

      const todo: Todo = message.getData()

      const todoData = {
        title: data.title,
        desc: data.desc,
        done: data.done,
      }

      message = await this.update(todoData, todo.id)

      if (!message.isSuccess()) {
        return message
      }

      return Message.success('All registered successfully!', todo)
    } catch (error) {
      return Message.error('It was not possible to edit everything.', null, error.message)
    }
  }
}
