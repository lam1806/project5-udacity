import { AllCartAccess } from "./ListTaskAcess";
import { createLogger } from "../utils/logger";
import * as uuid from 'uuid';

// TODO: Implement the fileStogare logic
const logger = createLogger('TodosAccess')
const todoAccessLayer = new AllCartAccess();

export const createAttachmentUrl = async (userId: string, todoId: string): Promise<string> => {
    logger.info("userId: ", userId, "todoId: ", todoId);
    const attachmentId = uuid.v4();

    return await todoAccessLayer.createAttachmentUrl(userId, todoId, attachmentId);
}