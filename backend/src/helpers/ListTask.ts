import { CartItem } from '../models/CartItem'
import { AllCartAccess } from './ListTaskAcess'
import { parseUserId } from '../auth/utils'

// TODO: Implement businessLogic

const allCartAccess = new AllCartAccess()
export async function getAllCart(jwtToken: string): Promise<CartItem[]> {
    const userId = parseUserId(jwtToken)
    return allCartAccess.getAllCart(userId)
  }
