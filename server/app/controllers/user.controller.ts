import { UserService } from '@app/services/user.service';
import { IUser } from '@app/db-models/user';
import { Router, Response, Request } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Service } from 'typedi';
import { ChatController } from './chat.controller';
import { Controller } from './base.controller';
import { Converter } from '@app/utils/converter';
import { UserProjection } from '@app/db-models/dto/user.dto';

import { generateSessionToken, verifyAdminSessionToken } from './authentication';

@Service()
export class UserController {
    router: Router;
    constructor(private userService: UserService) {
        this.configureRouter();
    }

    private configureRouter() {
        this.router = Router();
        ChatController.configureRouter(this.userService, this.router);

        this.router.get('/', async (req: Request, res: Response) => {
            try {
                res.status(StatusCodes.OK).send('Server working');
            } catch (error) {
                res.status(StatusCodes.NOT_FOUND).send(error.message);
            }
        });

        this.router.get('/:userId', verifyAdminSessionToken, async (req: Request, res: Response) => {
            const id = decodeURIComponent(req.params.userId);
            try {
                const user = await this.userService.getDocumentByIdLean(id, UserProjection.user);
                Controller.handleGetResponse(res, user);
            } catch (error) {
                res.status(StatusCodes.NOT_FOUND).send(error.message);
            }
        });

        this.router.get('/email/:email', verifyAdminSessionToken, async (req: Request, res: Response) => {
            const email = decodeURIComponent(req.params.email);
            try {
                const user = await this.userService.getDocumentByEmail(email, UserProjection.user);
                Controller.handleGetResponse(res, user);
            } catch (error) {
                res.status(StatusCodes.NOT_FOUND).send(error.message);
            }
        });

        this.router.post("/", verifyAdminSessionToken, async (req: Request, res: Response) => {
            try {
                const reqUser = req.body as IUser;
                const user = await this.userService.createUser(reqUser.name, reqUser.email);
                const userDto = Converter.objectToProjected(user, UserProjection.user);
                Controller.handlePostResponse(res, userDto);
            } catch (error) {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error.message);
            }
        });

        this.router.post("/guests", async (req: Request, res: Response) => {
            try {
                const user = await this.userService.createGuest();
                const userDto = Converter.objectToProjected(user, UserProjection.user);
                const sessionToken = generateSessionToken(userDto._id);
                Controller.handlePostResponse(res, { id: userDto._id, sessionToken });
            } catch (error) {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error.message);
            }
        });
    }
}
