import { parseUserId } from '../auth/utils'
import { UpdateCartRequest } from '../requests/UpdateCartRequest'
//import { TodoUpdate } from '../models/TodoUpdate'
import { AllCartAccess } from './ListTaskAcess'

const allCartAccess = new AllCartAccess()

export const  updateCart = async (updateCartRequest: UpdateCartRequest, todoId: string, jwtToken: string) => {
    const userId = parseUserId(jwtToken);
    await allCartAccess.updateCart(updateCartRequest, todoId, userId);
}