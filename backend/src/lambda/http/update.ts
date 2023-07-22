import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import {updateCart} from "../../helpers/UpdateTask";
//import { updateTodo } from '../../businessLogic/todos'
import { UpdateCartRequest } from '../../requests/UpdateCartRequest'
//import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const updatedCart: UpdateCartRequest = JSON.parse(event.body)

    const authorization = event.headers.Authorization;
    const split = authorization.split(' ');
    const jwtToken = split[1];
    // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
    const toDoItem = await updateCart(updatedCart, todoId, jwtToken);
    const result = {
      statusCode: 200,
      headers: {
          "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
          "item": toDoItem
      }),
  }
  return result
})

handler.use(httpErrorHandler()).use(
    cors({
      credentials: true
    })
  )
