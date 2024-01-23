import User from 'App/Models/User'
import Service from './Base/Service'
import Message from 'App/Models/Core/Message'

export default class UserService extends Service {
  constructor() {
    super(User)
  }

  public async createUser(data: any): Promise<Message> {
    try {
      let message = await this.validate(data)
      if (!message.isSuccess()) {
        return message
      }

      const userData = {
        name: data.name,
        email: data.email,
        password: data.password,
      }

      message = await this.create(userData)

      if (!message.isSuccess()) {
        return message
      }

      const user = message.getData()

      return Message.success('User registered successfully!', user)
    } catch (error) {
      return Message.error('Unable to register user.', null, error.message)
    }
  }
}
