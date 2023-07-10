import { Router, Response, Request } from 'express';
import { StatusCodes } from 'http-status-codes';
import { UserService } from '@app/services/user.service';
import { User } from '@app/db-models/user';
import { Chat, ChatDto, Message } from '@app/db-models/user.chat';
import { ObjectId } from 'mongodb';
import { OpenAIService } from '@app/services/openai.service';
import { Converter } from '@app/utils/converter';

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
                const chats = user.getChats(pageNo, countNo);

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
                const messages = user.chats[chatId].getMessages(pageNo, countNo);

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

        userRouter.get('/:userId/chat/:chatId/messages/:messageId/texts', async (req: Request, res: Response) => {
            try {
                const { userId, chatId, messageId } = req.params;
                const user = await userService.getOneDocumentFullInfo(userId) as User;
                const texts = user.chats[chatId].messages[messageId].texts;

                handleGetResponse(res, texts);
            } catch (error) {
                res.status(StatusCodes.NOT_FOUND).send(error.message);
            }
        });

        userRouter.get('/:userId/chat/:chatId/messages/:messageId/texts/:textNo', async (req: Request, res: Response) => {
            try {
                const { userId, chatId, messageId, textNo } = req.params;
                const textIndex = Number(textNo);
                const user = await userService.getOneDocumentFullInfo(userId) as User;
                const text = user.chats[chatId].messages[messageId].texts[textIndex];

                handleGetResponse(res, text);
            } catch (error) {
                res.status(StatusCodes.NOT_FOUND).send(error.message);
            }
        });

        userRouter.post('/:userId/chat/', async (req: Request, res: Response) => {
            try {
                const { userId } = req.params;
                const user = await userService.getOneDocumentFullInfo(userId) as User;
                const newId = getUniqueId(user.chats);

                if (!newId) {
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Something went wrong");
                    return;
                }

                const chat = req.body as Chat;
                chat.chatId = newId;
                user.chats[chat.chatId] = chat;

                handlePostResponse(res, chat);
            } catch (error) {
                res.status(StatusCodes.BAD_REQUEST).send(error.message);
            }
        });

        userRouter.post('/:userId/chat/:chatId/message', async (req: Request, res: Response) => {
            try {
                const { userId, chatId } = req.params;
                const user = await userService.getOneDocumentFullInfo(userId) as User;
                const newId = getUniqueId(user.chats[chatId].messages);

                if (!newId) {
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Something went wrong");
                    return;
                }

                const message = req.body as Message;
                message.messageId = newId;

                const ChatbotSettings = Converter.ChatToChatbotSettings(user.chats[chatId]);
                openAIService.sendChatCompletion(ChatbotSettings)
                    .then((result: string[]) => {
                        
                    })
                    .catch((error: any) => {
                        
                    });;

                handlePostResponse(res, message.messageId);
            } catch (error) {
                res.status(StatusCodes.BAD_REQUEST).send(error.message);
            }
        });


        userRouter.delete('/:userId/chat/:chatId', async (req: Request, res: Response) => {
            try {
                const { userId, chatId } = req.params;
                const user = await userService.getOneDocumentFullInfo(userId) as User;
                delete user.chats[chatId];

                handleDeleteResponse(res);
            } catch (error) {
                res.status(StatusCodes.BAD_REQUEST).send(error.message);
            }
        });

        userRouter.delete('/:userId/chat/:chatId/message/:messageId', async (req: Request, res: Response) => {
            try {
                const { userId, chatId, messageId } = req.params;
                const user = await userService.getOneDocumentFullInfo(userId) as User;
                delete user.chats[chatId].messages[messageId];

                handleDeleteResponse(res);
            } catch (error) {
                res.status(StatusCodes.BAD_REQUEST).send(error.message);
            }
        });

        function getUniqueId(collection: { [id: string]: any }) {
            let tryCount = 0;
            let id = new ObjectId().toString();

            while (collection.hasOwnProperty(id)) {
                if (tryCount > 100) {
                    return;
                }
                id = new ObjectId().toString();
                tryCount++;
            }

            return id;
        }

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
                res.status(StatusCodes.CREATED).send(itemToPost)
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