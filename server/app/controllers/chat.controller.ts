import { Router, Response, Request } from 'express';
import { StatusCodes } from 'http-status-codes';
import { UserService } from '@app/services/user.service';
import { User } from '@app/db-models/user';
import { OpenAIService } from '@app/services/openai.service';
import { Converter } from '@app/utils/converter';
import { ChatDto } from '@app/db-models/chat';

export class ChatController {

    static configureRouter(userService: UserService, userRouter: Router) {
        const openAIService = new OpenAIService();

        userRouter.get('/:userId/chat/', async (req: Request, res: Response) => {
            try {
                const userId = req.params.userId;
                const { page, count } = req.query;
                const pageNo = Number(page);
                const countNo = Number(count);
                const user = await userService.getOneDocumentFullInfo(userId) as User;
                const chats = Converter.chatDictToArray(user.chats, pageNo, countNo);
                handleGetResponse(res, chats);
            } catch (error) {
                res.status(StatusCodes.NOT_FOUND).send(error.message);
            }
        });

        userRouter.get('/:userId/chat/:chatId', async (req: Request, res: Response) => {
            try {
                const { userId, chatId } = req.params;
                const user = await userService.getOneDocumentFullInfo(userId) as User;
                const chat = user.chats[chatId] as ChatDto;
                handleGetResponse(res, chat);
            } catch (error) {
                res.status(StatusCodes.NOT_FOUND).send(error.message);
            }
        });

        userRouter.get('/:userId/chat/:chatId/messages', async (req: Request, res: Response) => {
            try {
                const { userId, chatId } = req.params;
                const { page, count } = req.query;
                const pageNo = Number(page);
                const countNo = Number(count);
                const user = await userService.getOneDocumentFullInfo(userId) as User;
                const messages = Converter.messageDictToArray(user.chats[chatId].messages, pageNo, countNo);
                handleGetResponse(res, messages);
            } catch (error) {
                res.status(StatusCodes.NOT_FOUND).send(error.message);
            }
        });

        userRouter.get('/:userId/chat/:chatId/messages/:messageId', async (req: Request, res: Response) => {
            try {
                const { userId, chatId, messageId } = req.params;
                const user = await userService.getOneDocumentFullInfo(userId) as User;
                const message = user.chats[chatId].messages[messageId];
                handleGetResponse(res, message);
            } catch (error) {
                res.status(StatusCodes.NOT_FOUND).send(error.message);
            }
        });

        userRouter.get('/:userId/chat/:chatId/messages/:messageId/choices', async (req: Request, res: Response) => {
            try {
                const { userId, chatId, messageId } = req.params;
                const user = await userService.getOneDocumentFullInfo(userId) as User;
                const choices = user.chats[chatId].messages[messageId].choices;
                handleGetResponse(res, choices);
            } catch (error) {
                res.status(StatusCodes.NOT_FOUND).send(error.message);
            }
        });

        userRouter.get('/:userId/chat/:chatId/messages/:messageId/choices/:choiceNo', async (req: Request, res: Response) => {
            try {
                const { userId, chatId, messageId, choiceNo } = req.params;
                const choiceIndex = Number(choiceNo);
                const user = await userService.getOneDocumentFullInfo(userId) as User;
                const choice = user.chats[chatId].messages[messageId].choices[choiceIndex];
                handleGetResponse(res, choice);
            } catch (error) {
                res.status(StatusCodes.NOT_FOUND).send(error.message);
            }
        });

        userRouter.post('/:userId/chat/', async (req: Request, res: Response) => {
            try {
                const { userId } = req.params;
                const chat = await userService.createChat(userId);
                handlePostResponse(res, chat);
            } catch (error) {
                res.status(StatusCodes.BAD_REQUEST).send(error.message);
            }
        });

        userRouter.post('/:userId/chat/:chatId/message', async (req: Request, res: Response) => {
            try {
                const { userId, chatId } = req.params;
                const user = await userService.getOneDocumentFullInfo(userId) as User;
                const chat = user.chats[chatId];
                const userChoices = req.body as string[];
                await userService.createMessage(user, chat, userChoices, true);

                //user socket emit

                const chatbotSettings = Converter.chatToChatbotSettings(chat);
                const botChoices = await openAIService.sendChatCompletion(chatbotSettings);
                await userService.createMessage(user, chat, botChoices, false);

                //bot socket emit

                res.status(StatusCodes.OK);

            } catch (error) {
                res.status(StatusCodes.BAD_REQUEST).send(error.message);
            }
        });


        userRouter.delete('/:userId/chat/:chatId', async (req: Request, res: Response) => {
            try {
                const { userId, chatId } = req.params;
                await userService.deleteChat(userId, chatId);
                handleDeleteResponse(res);
            } catch (error) {
                res.status(StatusCodes.BAD_REQUEST).send(error.message);
            }
        });

        userRouter.delete('/:userId/chat/:chatId/message/:messageId', async (req: Request, res: Response) => {
            try {
                const { userId, chatId, messageId } = req.params;
                await userService.deleteMessage(userId, chatId, messageId);
                handleDeleteResponse(res);
            } catch (error) {
                res.status(StatusCodes.BAD_REQUEST).send(error.message);
            }
        });

        function handleGetResponse(res: Response, itemToGet: any) {
            if (itemToGet) {
                res.status(StatusCodes.OK).send(itemToGet);
            }
            else {
                res.status(StatusCodes.NOT_FOUND).send("Failed to get.");
            }
        }

        function handlePostResponse(res: Response, itemToPost: any) {
            if (itemToPost) {
                res.status(StatusCodes.CREATED).send(itemToPost);
            }
            else {
                res.status(StatusCodes.BAD_REQUEST).send("Failed to post.");
            }
        }

        function handleDeleteResponse(res: Response) {
            res.sendStatus(StatusCodes.NO_CONTENT);
        }
    }
}