//import * as AWS from 'aws-sdk'
//import * as AWSXRay from 'aws-xray-sdk'
import { AllCartAccess } from "./ListTaskAcess";
import { createLogger } from "../utils/logger";
//const XAWS = AWSXRay.captureAWS(AWS)
import * as uuid from 'uuid';

// TODO: Implement the fileStogare logic
const logger = createLogger('TodosAccess')
const cartAccessLayer = new AllCartAccess();

export const createAttachmentUrl = async (userId: string, todoId: string): Promise<string> => {
    logger.info("userId: ", userId, "todoId: ", todoId);
    const attachmentId = uuid.v4();

    return await cartAccessLayer.createAttachmentUrl(userId, todoId, attachmentId);
}