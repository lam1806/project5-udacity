import { parseUserId } from '../auth/utils'
import { UpdateTodoRequest } from '../requests/UpdateTaskRequest'
//import { TodoUpdate } from '../models/TodoUpdate'
import { AllToDoAccess } from './ListTaskAcess'

const allToDoAccess = new AllToDoAccess()

export const  updateToDo = async (updateTodoRequest: UpdateTodoRequest, todoId: string, jwtToken: string) => {
    const userId = parseUserId(jwtToken);
    await allToDoAccess.updateTodo(updateTodoRequest, todoId, userId);
}