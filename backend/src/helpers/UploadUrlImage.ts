import { AllToDoAccess } from './ListTaskAcess'

const allToDoAccess = new AllToDoAccess()

export function uploadUrlImage(todoId: string): Promise<string> {
    return allToDoAccess.uploadUrlImage(todoId)
  }