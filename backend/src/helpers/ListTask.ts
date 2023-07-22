//import { TodosAccess } from './todosAcess'
//import { AttachmentUtils } from './attachmentUtils';
import { CartItem } from '../models/CartItem'
import { AllCartAccess } from './ListTaskAcess'
import { parseUserId } from '../auth/utils'
//import { CreateTodoRequest } from '../requests/CreateTodoRequest'
//import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
//import { createLogger } from '../utils/logger'
//import * as uuid from 'uuid'
//import * as createError from 'http-errors'

// TODO: Implement businessLogic

const allCartAccess = new AllCartAccess()
export async function getAllCart(jwtToken: string): Promise<CartItem[]> {
    const userId = parseUserId(jwtToken)
    return allCartAccess.getAllCart(userId)
  }
