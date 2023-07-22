
import { parseUserId } from '../auth/utils'
import { AllCartAccess } from './ListTaskAcess'

const allCartAccess = new AllCartAccess()

export function deleteCart(todoId: string, jwtToken: string): Promise<string> {
  console.log("todoId: ", todoId, "| jwtToken: ", jwtToken)
const userId = parseUserId(jwtToken)
return allCartAccess.deleteCart(todoId, userId)
}