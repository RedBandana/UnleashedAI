import { Router, Response, Request } from 'express';
import { StatusCodes } from 'http-status-codes';
import { UserService } from '@app/services/user.service';
import { Chat, ChatDto, Message, User } from '@app/db-models/user';
import { ObjectId } from 'mongodb';
import { ChatService } from '@app/services/openai.service';

export class ChatController {

    static configureRouter(userService: UserService, userRouter: Router) {
        const chatService = new ChatService();

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

        userRouter.get('/:userId/chat/:chatId/messages/:messageId/replies', async (req: Request, res: Response) => {
            try {
                const { userId, chatId, messageId } = req.params;
                const user = await userService.getOneDocumentFullInfo(userId) as User;
                const replies = user.chats[chatId].messages[messageId].replies;

                handleGetResponse(res, replies);
            } catch (error) {
                res.status(StatusCodes.NOT_FOUND).send(error.message);
            }
        });

        userRouter.get('/:userId/chat/:chatId/messages/:messageId/replies/:replyId', async (req: Request, res: Response) => {
            try {
                const { userId, chatId, messageId, replyId } = req.params;
                const user = await userService.getOneDocumentFullInfo(userId) as User;
                const reply = user.chats[chatId].messages[messageId].replies.filter(r => r.replyId == replyId);

                handleGetResponse(res, reply);
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

                chatService.sendChatCompletion(user.chats[chatId].settings as any)
                    .then((result) => {
                        console.log(result);
                        // Code to execute after the async function is completed
                        console.log("Async function execution completed");
                    })
                    .catch((error) => {
                        console.error(error);
                    });;

                const message = req.body as Message;
                message.messageId = newId;

                handlePostResponse(res, message);
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