import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import TodoService from 'App/Service/TodoService'

export default class TodosController {
  private todoService: TodoService

  constructor() {
    this.todoService = new TodoService()
  }

  public async index({}: HttpContextContract) {
    const todos = await this.todoService.all()

    const data = todos.getData()

    return data
  }

  public async show({ params }: HttpContextContract) {
    try {
      const todo = await this.todoService.find(params.id)

      const todoData = todo.getData()

      if (todoData) {
        return todoData
      }
    } catch (error) {
      console.log(error)
    }
  }

  public async update({ request, params }: HttpContextContract) {
    const todo = await this.todoService.find(params.id)

    const todoData = todo.getData()

    if (todo) {
      todoData.title = request.input('title')
      todoData.desc = request.input('desc')
      todoData.done = request.input('done')

      if (await todoData.save()) {
        return todo
      }
      return // status code: 422
    }
    return // status code: 401
  }

  public async store({ auth, request }: HttpContextContract) {
    const user = await auth.authenticate()

    const requestData = request.all()

    const newTodo = await this.todoService.createTodo(requestData)

    return newTodo
  }

  public async destroy({ response, auth, params }: HttpContextContract) {
    const user = await auth.authenticate()

    const { id } = params

    const message = await this.todoService.delete(id)

    return response.json({ message: 'Deleted successfully' })
  }
}
