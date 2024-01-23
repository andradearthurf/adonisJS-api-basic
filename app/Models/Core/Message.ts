class Message {
  private type: string
  private message: string
  private data: any
  private errors: any

  public static MESSAGE_SUCCESS = 'success'
  public static MESSAGE_ERROR = 'danger'
  public static MESSAGE_WARNING = 'warning'

  public static success(message: string, data: any): Message {
    const instance = new Message()

    instance.type = Message.MESSAGE_SUCCESS
    instance.message = instance.filter(message)
    instance.data = data
    instance.errors = null

    return instance
  }

  public static error(message: string, data: any, errors: any): Message {
    const instance = new Message()

    instance.type = Message.MESSAGE_ERROR
    instance.message = instance.filter(message)
    instance.data = data
    instance.errors = errors

    return instance
  }

  public static warning(message: string, data: any, errors: any): Message {
    const instance = new Message()

    instance.type = Message.MESSAGE_WARNING
    instance.message = instance.filter(message)
    instance.data = data
    instance.errors = errors

    return instance
  }

  public isSuccess(): boolean {
    return this.type === Message.MESSAGE_SUCCESS
  }

  public isError(): boolean {
    return this.type === Message.MESSAGE_ERROR
  }

  public isWarning(): boolean {
    return this.type === Message.MESSAGE_WARNING
  }

  public getType(): string {
    return this.type
  }

  public getMessage(): string {
    return this.message
  }

  public getData(): any {
    return this.data
  }

  public getErrors(): any {
    return this.errors
  }

  public getFlash(): any {
    return { type: this.type, message: this.message }
  }

  private filter(message: string): string {
    return message
  }
}

export default Message
