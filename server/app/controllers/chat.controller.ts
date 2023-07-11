import { Router, Response, Request } from 'express';
import { StatusCodes } from 'http-status-codes';
import { UserService } from '@app/services/user.service';
import { User } from '@app/db-models/user';
import { OpenAIService } from '@app/services/openai.service';
import { Converter } from '@app/utils/converter';
import { ChatDto } from '@app/db-models/chat';
import { Controller } from './base.controller';
import { Utils } from '@app/utils/utils';

export class ChatController {

    static configureRouter(userService: UserService, userRouter: Router) {
        const openAIService = new OpenAIService();

        userRouter.get('/:userId/chats', async (req: Request, res: Response) => {
            try {
                const userId = req.params.userId;
                const { page, count } = req.query;
                const pageNo = Number(page ?? 1);
                const countNo = Number(count ?? Utils.DEFAULT_COUNT);
                const user = await userService.getOneDocumentFullInfo(userId) as User;
                const chats = Converter.getPageCount(user.chats.map(c => c.title), pageNo, countNo);
                Controller.handleGetResponse(res, chats);
            } catch (error) {
                res.status(StatusCodes.NOT_FOUND).send(error.message);
            }
        });

        userRouter.get('/:userId/chats/:chatId', async (req: Request, res: Response) => {
            try {
                const { userId, chatId } = req.params;
                const chatIndex = Number(chatId);
                const user = await userService.getOneDocumentFullInfo(userId) as User;
                const chat = user.chats[chatIndex] as ChatDto;
                Controller.handleGetResponse(res, chat);
            } catch (error) {
                res.status(StatusCodes.NOT_FOUND).send(error.message);
            }
        });

        userRouter.get('/:userId/chats/:chatId/messages', async (req: Request, res: Response) => {
            try {
                const { userId, chatId } = req.params;
                const { page, count } = req.query;
                const chatIndex = Number(chatId);
                const pageNo = Number(page ?? 1);
                const countNo = Number(count ?? Utils.DEFAULT_COUNT);
                const user = await userService.getOneDocumentFullInfo(userId) as User;
                const messages = Converter.getPageCount(user.chats[chatIndex].messages, pageNo, countNo);
                Controller.handleGetResponse(res, messages);
            } catch (error) {
                res.status(StatusCodes.NOT_FOUND).send(error.message);
            }
        });

        userRouter.get('/:userId/chats/:chatId/messages/:messageId', async (req: Request, res: Response) => {
            try {
                const { userId, chatId, messageId } = req.params;
                const chatIndex = Number(chatId);
                const messageIndex = Number(messageId);
                const user = await userService.getOneDocumentFullInfo(userId) as User;
                const message = user.chats[chatIndex].messages[messageIndex];
                Controller.handleGetResponse(res, message);
            } catch (error) {
                res.status(StatusCodes.NOT_FOUND).send(error.message);
            }
        });

        userRouter.get('/:userId/chats/:chatId/messages/:messageId/choices', async (req: Request, res: Response) => {
            try {
                const { userId, chatId, messageId } = req.params;
                const chatIndex = Number(chatId);
                const messageIndex = Number(messageId);
                const user = await userService.getOneDocumentFullInfo(userId) as User;
                const message = user.chats[chatIndex].messages[messageIndex];
                const choices = message.choices ?? [message];
                Controller.handleGetResponse(res, choices);
            } catch (error) {
                res.status(StatusCodes.NOT_FOUND).send(error.message);
            }
        });

        userRouter.get('/:userId/chats/:chatId/messages/:messageId/choices/:choiceId', async (req: Request, res: Response) => {
            try {
                const { userId, chatId, messageId, choiceId } = req.params;
                const chatIndex = Number(chatId);
                const messageIndex = Number(messageId);
                const choiceIndex = Number(choiceId);
                const user = await userService.getOneDocumentFullInfo(userId) as User;
                const message = user.chats[chatIndex].messages[messageIndex];
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

        userRouter.put('/:userId/chats/:chatId/messages', async (req: Request, res: Response) => {
            try {
                const { userId, chatId } = req.params;
                const chatIndex = Number(chatId);
                const userContent: string = req.body;
                console.log(req.body);
                console.log(userContent);
                const userMessage = await userService.createMessage(userId, chatId, userContent);
                
                //user socket emit
                
                const user = await userService.getOneDocumentFullInfo(userId) as User;
                user.chats[chatIndex].messages.push(userMessage);

                const chatbotSettings = Converter.chatToChatbotSettings(user.chats[chatIndex]);
                const botChoices = await openAIService.sendChatCompletion(chatbotSettings);
                const botMessage = await userService.createBotMessage(userId, chatId, botChoices);

                //bot socket emit

                res.status(StatusCodes.OK).send([userMessage, botMessage]);

            } catch (error) {
                res.status(StatusCodes.BAD_REQUEST).send(error.message);
            }
        });


        userRouter.delete('/:userId/chats/:chatId', async (req: Request, res: Response) => {
            try {
                const { userId, chatId } = req.params;
                await userService.deleteChat(userId, chatId);
                Controller.handleDeleteResponse(res);
            } catch (error) {
                res.status(StatusCodes.BAD_REQUEST).send(error.message);
            }
        });

        userRouter.delete('/:userId/chats/:chatId/messages/:messageId', async (req: Request, res: Response) => {
            try {
                const { userId, chatId, messageId } = req.params;
                await userService.deleteMessage(userId, chatId, messageId);
                Controller.handleDeleteResponse(res);
            } catch (error) {
                res.status(StatusCodes.BAD_REQUEST).send(error.message);
            }
        });
    }
}