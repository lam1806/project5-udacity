import { CartItem } from '../models/CartItem'
import { parseUserId } from '../auth/utils'
import { CreateCartRequest } from '../requests/CreateCartRequest'
import { AllCartAccess } from './ListTaskAcess'

const uuidv4 = require('uuid/v4')
const allCartAccess = new AllCartAccess()

export function createCart(
    createCartRequest: CreateCartRequest,
    jwtToken: string
  ): Promise<CartItem> {
    const userId = parseUserId(jwtToken)
    const todoId = uuidv4()
    //const s3BucketName = process.env.ATTACHMENT_S3_BUCKET_VALUE
    //const urlAttachment = `https://${s3BucketName}.s3.amazonaws.com/${todoId}`
    return allCartAccess.createCart({
      userId: userId,
      todoId: todoId,
      createdAt: new Date().getTime().toString(),
      attachmentUrl: null,
      done: false,
      ...createCartRequest
    })
  }