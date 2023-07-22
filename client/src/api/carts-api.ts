import { apiEndpoint } from '../config'
import { Cart } from '../types/Cart';
import { CreateCartRequest } from '../types/CreateCartRequest';
import Axios from 'axios'
import { UpdateCartRequest } from '../types/UpdateCartRequest';

export async function getCarts(idToken: string): Promise<Cart[]> {
  console.log('Fetching carts')

  const response = await Axios.get(`${apiEndpoint}/carts`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Todos:', response.data)
  return response.data.items
}

export async function createCart(
  idToken: string,
  newCart: CreateCartRequest
): Promise<Cart> {
  const response = await Axios.post(`${apiEndpoint}/carts`,  JSON.stringify(newCart), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function patchCart(
  idToken: string,
  todoId: string,
  updatedTodo: UpdateCartRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/todos/${todoId}`, JSON.stringify(updatedTodo), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteCart(
  idToken: string,
  todoId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/todos/${todoId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  todoId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/todos/${todoId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}
