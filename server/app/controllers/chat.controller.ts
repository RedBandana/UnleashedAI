import { Router, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { UserService } from '@app/services/user.service';
import { OpenAIService } from '@app/services/openai.service';
import { Converter } from '@app/utils/converter';
import { Controller } from './base.controller';
import { ChatUtils } from '@app/utils/chat.utils';
import { IChatRequest, IMessageRequest } from '@app/db-models/chat';
import { verifySessionToken } from './authentication';
import { IRequest } from '@app/interfaces/request';

export class ChatController {

    static configureRouter(userService: UserService, userRouter: Router) {
        const openAIService = new OpenAIService();

        userRouter.get('/me/chats', verifySessionToken, async (req: IRequest, res: Response) => {
            try {
                const userId = req.user.userId;
                const { page, count } = req.query;
                const pageNo = Number(page ?? 1);
                const countNo = Number(count ?? ChatUtils.DEFAULT_COUNT);
                const chats = await userService.getChats(userId, pageNo, countNo);
                Controller.handleGetResponse(res, chats);
            } catch (error) {
                res.status(StatusCodes.NOT_FOUND).send(error.message);
            }
        });

        userRouter.get('/me/chats/:chatIndex', verifySessionToken,async (req: IRequest, res: Response) => {
            try {
                const userId = req.user.userId;
                const { chatIndex } = req.params;
                const chatNo = Number(chatIndex);
                const chat: any = await userService.getChatByIndex(userId, chatNo);
                Controller.handleGetResponse(res, chat);
            } catch (error) {
                res.status(StatusCodes.NOT_FOUND).send(error.message);
            }
        });

        userRouter.get('/me/chats/:chatIndex/messages', verifySessionToken, async (req: IRequest, res: Response) => {
            try {
                const userId = req.user.userId;
                const { chatIndex } = req.params;
                const { page, count } = req.query;
                const chatNo = Number(chatIndex);
                const pageNo = Number(page ?? 1);
                const countNo = Number(count ?? ChatUtils.DEFAULT_COUNT);
                const messages = await userService.getMessages(userId, chatNo, pageNo, countNo);
                Controller.handleGetResponse(res, messages);
            } catch (error) {
                res.status(StatusCodes.NOT_FOUND).send(error.message);
            }
        });

        userRouter.get('/me/chats/:chatIndex/messages/:messageIndex', verifySessionToken, async (req: IRequest, res: Response) => {
            try {
                const userId = req.user.userId;
                const { chatIndex, messageIndex } = req.params;
                const chatNo = Number(chatIndex);
                const messageNo = Number(messageIndex);
                const message = await userService.getMessageByIndex(userId, chatNo, messageNo);
                Controller.handleGetResponse(res, message);
            } catch (error) {
                res.status(StatusCodes.NOT_FOUND).send(error.message);
            }
        });

        userRouter.get('/me/chats/:chatIndex/messages/:messageIndex/choices', verifySessionToken, async (req: IRequest, res: Response) => {
            try {
                const userId = req.user.userId;
                const { chatIndex, messageIndex } = req.params;
                const chatNo = Number(chatIndex);
                const messageNo = Number(messageIndex);
                const choices = await userService.getMessageChoices(userId, chatNo, messageNo);
                Controller.handleGetResponse(res, choices);
            } catch (error) {
                res.status(StatusCodes.NOT_FOUND).send(error.message);
            }
        });

        userRouter.get('/me/chats/:chatIndex/messages/:messageIndex/choices/:choiceIndex', verifySessionToken, async (req: IRequest, res: Response) => {
            try {
                const userId = req.user.userId;
                const { chatIndex, messageIndex, choiceIndex } = req.params;
                const chatNo = Number(chatIndex);
                const messageNo = Number(messageIndex);
                const choiceNo = Number(choiceIndex);
                const choices: any = await userService.getMessageChoices(userId, chatNo, messageNo);
                await userService.updateMessageChoice(userId, chatNo, messageNo, choiceNo);

                const choice = choices[choiceNo];
                Controller.handleGetResponse(res, choice);
            } catch (error) {
                res.status(StatusCodes.NOT_FOUND).send(error.message);
            }
        });

        userRouter.put('/me/chats/:chatIndex', verifySessionToken, async (req: IRequest, res: Response) => {
            try {
                const userId = req.user.userId;
                const { chatIndex } = req.params;
                const chatNo = Number(chatIndex);
                const chatEdit = req.body as IChatRequest;
                const finalChat = await userService.updateChat(userId, chatNo, chatEdit);
                Controller.handlePutResponse(res, finalChat);
            } catch (error) {
                res.status(StatusCodes.BAD_REQUEST).send(error.message);
            }
        });

        userRouter.post('/me/chats', verifySessionToken, async (req: IRequest, res: Response) => {
            try {
                const userId = req.user.userId;
                const chat = await userService.createChat(userId);
                Controller.handlePostResponse(res, chat);
            } catch (error) {
                res.status(StatusCodes.BAD_REQUEST).send(error.message);
            }
        });

        userRouter.post('/me/chats/:chatIndex/messages', verifySessionToken, async (req: IRequest, res: Response) => {
            try {
                const userId = req.user.userId;
                const { chatIndex } = req.params;
                const chatNo = Number(chatIndex);
                const userContent: IMessageRequest = req.body;

                const userMessage = await userService.createMessage(userId, chatNo, userContent.content);
                const chat: any = await userService.getChatByIndex(userId, chatNo);
                const messages = await userService.getMessages(userId, chatNo, 1, chat.settings.memory);
                messages.push(userMessage);

                const chatbotSettings = Converter.chatToChatbotSettings(chat.settings);
                const finalMessages = ChatUtils.getRequestMessages(messages, chat.settings);
                finalMessages.forEach(m => chatbotSettings.messages.push(Converter.messageToChatbotMessage(m)));

                const botChoices = await openAIService.sendChatCompletion(chatbotSettings);
                const botMessage = await userService.createBotMessage(userId, chatNo, botChoices);

                const chatUpdate: any = { };
                chatUpdate[`chats.${chatIndex}.latestMessageCreatedOn`] = botMessage.createdOn;
                await userService.updateChatForce(userId, chatNo, chatUpdate);

                //bot socket emit
                res.status(StatusCodes.OK).send(botMessage);

            } catch (error) {
                res.status(StatusCodes.BAD_REQUEST).send(error.message);
            }
        });

        userRouter.delete('/me/chats', verifySessionToken, async (req: IRequest, res: Response) => {
            try {
                const userId = req.user.userId;
                await userService.deleteChats(userId);
                Controller.handleDeleteResponse(res);
            } catch (error) {
                res.status(StatusCodes.NOT_FOUND).send(error.message);
            }
        });

        userRouter.delete('/me/chats/:chatIndex', verifySessionToken, async (req: IRequest, res: Response) => {
            try {
                const userId = req.user.userId;
                const { chatIndex } = req.params;
                const chatNo = Number(chatIndex);
                await userService.deleteChat(userId, chatNo);
                Controller.handleDeleteResponse(res);
            } catch (error) {
                res.status(StatusCodes.BAD_REQUEST).send(error.message);
            }
        });

        userRouter.delete('/me/chats/:chatIndex/messages/:messageIndex', verifySessionToken, async (req: IRequest, res: Response) => {
            try {
                const userId = req.user.userId;
                const { chatIndex, messageIndex } = req.params;
                const chatNo = Number(chatIndex);
                const messageNo = Number(messageIndex);
                await userService.deleteMessage(userId, chatNo, messageNo);
                Controller.handleDeleteResponse(res);
            } catch (error) {
                res.status(StatusCodes.BAD_REQUEST).send(error.message);
            }
        });
    }
}