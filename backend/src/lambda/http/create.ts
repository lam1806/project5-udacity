import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { CreateCartRequest } from '../../requests/CreateCartRequest'
import { createCart } from '../../helpers/CreateTask'
import { cors, httpErrorHandler } from 'middy/middlewares'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newTodo: CreateCartRequest = JSON.parse(event.body)
    const authorization = event.headers.Authorization
    const split = authorization.split(' ')
    const jwtToken = split[1]
    const toDoItem = await createCart(newTodo, jwtToken)
    const result = {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        item: toDoItem
      })
    }
    return result
  })

  handler.use(httpErrorHandler()).use(
    cors({
      credentials: true
    })
  )