import { Router, Response, Request } from 'express';
import { StatusCodes } from 'http-status-codes';
import { UserService } from '@app/services/user.service';
import { IUser, UserProjection } from '@app/db-models/user';
import { OpenAIService } from '@app/services/openai.service';
import { Converter } from '@app/utils/converter';
import { Controller } from './base.controller';
import { ChatUtils } from '@app/utils/chat.utils';

export class ChatController {

    static configureRouter(userService: UserService, userRouter: Router) {
        const openAIService = new OpenAIService();

        userRouter.get('/:userId/chats', async (req: Request, res: Response) => {
            try {
                const userId = req.params.userId;
                const { page, count } = req.query;
                const pageNo = Number(page ?? 1);
                const countNo = Number(count ?? ChatUtils.DEFAULT_COUNT);
                const user = await userService.getDocumentByIdLean(userId, UserProjection.chatsLean) as IUser;
                const chats = Converter.getPageCount(user.chats, pageNo, countNo);
                Controller.handleGetResponse(res, chats);
            } catch (error) {
                res.status(StatusCodes.NOT_FOUND).send(error.message);
            }
        });

        userRouter.get('/:userId/chats/:chatIndex', async (req: Request, res: Response) => {
            try {
                const { userId, chatIndex } = req.params;
                const chatNo = Number(chatIndex);
                const user = await userService.getDocumentByIdLean(userId, UserProjection.chat) as IUser;
                const chat = user.chats[chatNo];
                Controller.handleGetResponse(res, chat);
            } catch (error) {
                res.status(StatusCodes.NOT_FOUND).send(error.message);
            }
        });

        userRouter.get('/:userId/chats/:chatIndex/messages', async (req: Request, res: Response) => {
            try {
                const { userId, chatIndex } = req.params;
                const { page, count } = req.query;
                const chatNo = Number(chatIndex);
                const pageNo = Number(page ?? 1);
                const countNo = Number(count ?? ChatUtils.DEFAULT_COUNT);
                const user = await userService.getDocumentByIdLean(userId, UserProjection.chats) as IUser;
                const messages = Converter.getPageCount(user.chats[chatNo].messages, pageNo, countNo);
                Controller.handleGetResponse(res, messages);
            } catch (error) {
                res.status(StatusCodes.NOT_FOUND).send(error.message);
            }
        });

        userRouter.get('/:userId/chats/:chatIndex/messages/:messageIndex', async (req: Request, res: Response) => {
            try {
                const { userId, chatIndex, messageIndex } = req.params;
                const chatNo = Number(chatIndex);
                const messageNo = Number(messageIndex);
                const user = await userService.getDocumentByIdLean(userId, UserProjection.chats) as IUser;
                const message = user.chats[chatNo].messages[messageNo];
                Controller.handleGetResponse(res, message);
            } catch (error) {
                res.status(StatusCodes.NOT_FOUND).send(error.message);
            }
        });

        userRouter.get('/:userId/chats/:chatIndex/messages/:messageIndex/choices', async (req: Request, res: Response) => {
            try {
                const { userId, chatIndex, messageIndex } = req.params;
                const chatNo = Number(chatIndex);
                const messageNo = Number(messageIndex);
                const user = await userService.getDocumentByIdLean(userId, UserProjection.chats) as IUser;
                const message = user.chats[chatNo].messages[messageNo];
                const choices = message.choices ?? [message];
                Controller.handleGetResponse(res, choices);
            } catch (error) {
                res.status(StatusCodes.NOT_FOUND).send(error.message);
            }
        });

        userRouter.get('/:userId/chats/:chatIndex/messages/:messageIndex/choices/:choiceId', async (req: Request, res: Response) => {
            try {
                const { userId, chatIndex, messageIndex, choiceId } = req.params;
                const chatNo = Number(chatIndex);
                const messageNo = Number(messageIndex);
                const choiceIndex = Number(choiceId);
                const user = await userService.getDocumentByIdLean(userId, UserProjection.chats) as IUser;
                const message = user.chats[chatNo].messages[messageNo];
                const choice = message.choices ? message.choices[choiceIndex] : message.content;
                Controller.handleGetResponse(res, choice);
            } catch (error) {
                res.status(StatusCodes.NOT_FOUND).send(error.message);
            }
        });

        userRouter.put('/:userId/chats', async (req: Request, res: Response) => {
            try {
                const { userId } = req.params;
                const chat = await userService.createChat(userId);
                Controller.handlePutResponse(res, chat);
            } catch (error) {
                res.status(StatusCodes.BAD_REQUEST).send(error.message);
            }
        });

        userRouter.put('/:userId/chats/:chatIndex/messages', async (req: Request, res: Response) => {
            try {
                const { userId, chatIndex } = req.params;
                const chatNo = Number(chatIndex);
                const userContent: string = req.body;
                console.log(req.body);
                console.log(userContent);
                const userMessage = await userService.createMessage(userId, chatIndex, userContent);

                //user socket emit

                const user = await userService.getDocumentByIdLean(userId, UserProjection.chats) as IUser;
                user.chats[chatNo].messages.push(userMessage);

                const chatbotSettings = Converter.chatToChatbotSettings(user.chats[chatNo]);
                const botChoices = await openAIService.sendChatCompletion(chatbotSettings);
                const botMessage = await userService.createBotMessage(userId, chatIndex, botChoices);

                //bot socket emit

                res.status(StatusCodes.OK).send([userMessage, botMessage]);

            } catch (error) {
                res.status(StatusCodes.BAD_REQUEST).send(error.message);
            }
        });


        userRouter.delete('/:userId/chats/:chatId', async (req: Request, res: Response) => {
            try {
                const { userId, chatIndex } = req.params;
                await userService.deleteChat(userId, chatIndex);
                Controller.handleDeleteResponse(res);
            } catch (error) {
                res.status(StatusCodes.BAD_REQUEST).send(error.message);
            }
        });

        userRouter.delete('/:userId/chats/:chatIndex/messages/:messageIndex', async (req: Request, res: Response) => {
            try {
                const { userId, chatIndex, messageIndex } = req.params;
                await userService.deleteMessage(userId, chatIndex, messageIndex);
                Controller.handleDeleteResponse(res);
            } catch (error) {
                res.status(StatusCodes.BAD_REQUEST).send(error.message);
            }
        });
    }
}