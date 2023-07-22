import { AllCartAccess } from './ListTaskAcess'

const allCartAccess = new AllCartAccess()

export function uploadUrlImage(todoId: string): Promise<string> {
    return allCartAccess.uploadUrlImage(todoId)
  }