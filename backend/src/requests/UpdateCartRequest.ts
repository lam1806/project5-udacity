/**
 * Fields in a request to update a single TODO item.
 */
export interface UpdateCartRequest {
  name: string
  dueDate: string
  done: boolean
}