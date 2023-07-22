import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { S3 } from 'aws-sdk'
import { CartItem } from '../models/CartItem'
import { CartUpdate } from '../models/CartUpdate'
import { Attachment } from './Attachments';
import { createLogger } from '../utils/logger';

const logger = createLogger('TodosAccess')

export class AllCartAccess {
  private readonly docClient: DocumentClient
  private readonly s3Client: S3
  private readonly todoTable: string
  private readonly s3BucketName= process.env.ATTACHMENT_S3_BUCKET_VALUE;

  constructor(
    docClient?: DocumentClient,
    s3Client?: S3,
    todoTable?: string,
    //s3BucketName?: string
  ) {
    this.docClient = docClient || new DocumentClient()
    this.s3Client = s3Client || new S3({ signatureVersion: 'v4' })
    this.todoTable = todoTable || process.env.CARTS_TABLE || ''
    //this.s3BucketName = s3BucketName || process.env.ATTACHMENT_S3_BUCKET_VALUE || ''
  }

  public async getAllCart(userId: string): Promise<CartItem[]> {
    console.log('Getting all item todos ')

    const params: DocumentClient.QueryInput = {
      TableName: this.todoTable,
      KeyConditionExpression: '#userId = :userId',
      ExpressionAttributeNames: {
        '#userId': 'userId'
      },
      ExpressionAttributeValues: {
        ':userId': userId
      }
    }

    const result = await this.docClient.query(params).promise()

    const items: CartItem[] = result.Items as CartItem[]
    return items
  }

  public async createCart(todoItem: CartItem): Promise<CartItem> {
    console.log('Creating new todo')
    const params: DocumentClient.PutItemInput = {
      TableName: this.todoTable,
      Item: todoItem
    }
    await this.docClient.put(params).promise()
    console.log('Todo created successfully')
    return todoItem
  }

  public async updateCart( todo: CartUpdate, userId: string, todoId: string ) {
    if (userId) {
        logger.info(`Found todo ${todoId}, ready for update`);
        console.log("updateTodo")
        await this.docClient.update({
            TableName: this.todoTable,
            Key: {
                todoId,
                userId
            },
            UpdateExpression: "set #name = :name, #price = :price, #description = :description, #done = :done",
            ExpressionAttributeNames: {
                "#name": "name",
                "#price": "price",
                "#description": "description",
                "#done": "done"
            },
            ExpressionAttributeValues: {
                ":name": todo.name,
                ":price": todo.price,
                ":description": todo.description,
                ":done": todo.done
            }
        }).promise();
        logger.info("Updated successfull ", todo)
    } else {
        logger.error(`Unauthenticated operation`);
    }
}

  async uploadUrlImage(todoId: string): Promise<string> {
    console.log('Generating URL')
    const url = this.s3Client.getSignedUrl('putObject', {
      Bucket: this.s3BucketName,
      Key: todoId,
      Expires: 1000
    })
    console.log(url)
    return url as string
  }

  async deleteCart(todoId: string, userId: string): Promise<string> {
    console.log('Deleting todo')

    const params = {
      Key: {
        userId: userId,
        todoId: todoId
      },
      TableName: this.todoTable
    }
    try {
      const result = await this.docClient.delete(params).promise()
      console.log(result)

      return '' as string
    }
    catch (error) {
      console.error("An error occurred while deleting the todo:", error);
      throw error;
    }  
  }

  public async createAttachmentUrl(userId: string, todoId: string, attachmentId: string) {
    const attachmentUrlUtil = new Attachment();
    const attachmentUrl = `https://${this.s3BucketName}.s3.amazonaws.com/${attachmentId}`;

    console.log("createAttachmentUrl")
    if (userId) {
      try {
        await this.docClient.update({
            TableName: this.todoTable,
            Key: {
                todoId, userId
            },
            UpdateExpression: "set #attachmentUrl = :attachmentUrl",
            ExpressionAttributeNames: {
                "#attachmentUrl": "attachmentUrl"
            },
            ExpressionAttributeValues: {
                ":attachmentUrl": attachmentUrl
            }
        }).promise();
        logger.info(`Url ${await attachmentUrlUtil.createAttachmentUrl(attachmentId)}`);
        return await attachmentUrlUtil.createAttachmentUrl(attachmentId);
      }
      catch (error){
        console.error("An error occurred while updating the attachment URL:", error);
        throw error;
      }
    } 
    else {
        logger.error("Unauthenticated operation");
    }
}
}
