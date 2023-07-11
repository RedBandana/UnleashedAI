import { UserService } from '@app/services/user.service';
import { User } from '@app/db-models/user';
import { Router, Response, Request } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Service } from 'typedi';
import { ChatController } from './chat.controller';
import { Controller } from './base.controller';

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

        this.router.get('/:userId', async (req: Request, res: Response) => {
            const id = decodeURIComponent(req.params.userId);
            try {
                const user = await this.userService.getOneDocumentFullInfo(id)
                Controller.handleGetResponse(res, user);
            } catch (error) {
                res.status(StatusCodes.NOT_FOUND).send(error.message);
            }
        });

        this.router.get('/email/:email', async (req: Request, res: Response) => {
            const email = decodeURIComponent(req.params.email);
            try {
                const user = await this.userService.getDocumentByEmail(email);
                Controller.handleGetResponse(res, user);
            } catch (error) {
                res.status(StatusCodes.NOT_FOUND).send(error.message);
            }
        });

        this.router.post("/", async (req: Request, res: Response) => {
            try {
                const reqUser = req.body as User;
                const user = await this.userService.createUser(reqUser.name, reqUser.email);
                Controller.handlePostResponse(res, user);
            } catch (error) {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error.message);
            }
        });
    }
}
