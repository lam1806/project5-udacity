import { TodoItem } from '../models/CartItem'
import { parseUserId } from '../auth/utils'
import { CreateTodoRequest } from '../requests/CreateCartRequest'
import { AllToDoAccess } from './ListTaskAcess'

const uuidv4 = require('uuid/v4')
const allToDoAccess = new AllToDoAccess()

export function createToDo(
    createTodoRequest: CreateTodoRequest,
    jwtToken: string
  ): Promise<TodoItem> {
    const userId = parseUserId(jwtToken)
    const todoId = uuidv4()
    //const s3BucketName = process.env.ATTACHMENT_S3_BUCKET_VALUE
    //const urlAttachment = `https://${s3BucketName}.s3.amazonaws.com/${todoId}`
    return allToDoAccess.createToDo({
      userId: userId,
      todoId: todoId,
      createdAt: new Date().getTime().toString(),
      attachmentUrl: null,
      price: null,
      description: null,
      done: false,
      ...createTodoRequest
    })
  }