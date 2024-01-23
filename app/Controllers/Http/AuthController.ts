import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UserService from 'App/Service/UserService'

export default class AuthController {
  private userService: UserService

  constructor() {
    this.userService = new UserService()
  }

  public async login({ request, auth }: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')

    const token = await auth.use('api').attempt(email, password, {
      expiresIn: '10 days',
    })
    return token.toJSON()
  }

  public async register({ request, auth }: HttpContextContract) {
    const requestData = request.all()

    const newUser = await this.userService.createUser(requestData)

    const data = newUser.getData()

    const token = await auth.use('api').login(data, {
      expiresIn: '10 days',
    })

    return token.toJSON()
  }
}
