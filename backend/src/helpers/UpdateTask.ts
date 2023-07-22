import { parseUserId } from '../auth/utils'
import { UpdateCartRequest } from '../requests/UpdateCartRequest'
import { AllCartAccess } from './ListTaskAcess'

const allCartAccess = new AllCartAccess()

export const  updateCart = async (UpdateCartRequest: UpdateCartRequest, todoId: string, jwtToken: string) => {
    const userId = parseUserId(jwtToken);
    await allCartAccess.updateCart(UpdateCartRequest, todoId, userId);
}