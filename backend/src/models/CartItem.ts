export interface CartItem {
  userId: string
  todoId: string
  createdAt: string
  name: string
  price: string
  description: string
  done: boolean
  attachmentUrl?: string
}
