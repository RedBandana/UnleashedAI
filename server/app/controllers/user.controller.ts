import { UserService } from '@app/services/user.service';
import { Router, Response, Request } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Service } from 'typedi';
import { ChatController } from './chat.controller';
import { Controller } from './base.controller';
import { Converter } from '@app/utils/converter';
import { UserProjection } from '@app/db-models/dto/user.dto';

import { generateSessionToken, verifyAdminSessionToken, verifySessionToken } from './authentication';
import { IRequest } from '@app/interfaces/request';

import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { createHashedPassword, signCookie, validateEmail } from '@app/utils/functions';
import { IUserRequest } from '@app/db-models/user';
import { mailTransporter } from '@app/utils/mail-transproter';

@Service()
export class UserController {
    router: Router;
    constructor(private userService: UserService) {
        this.configureRouter();
    }

    private configureRouter() {
        this.router = Router();
        ChatController.configureRouter(this.userService, this.router);

        this.router.get('/me', verifySessionToken, async (req: IRequest, res: Response) => {
            try {
                const userId = req.user.userId;
                const user = await this.userService.getDocumentByIdLean(userId, UserProjection.user);
                const cookieInfo = signCookie("https://cdn.unleashedai.org/users/00/");
                res.setHeader('Set-Cookie', cookieInfo);
                Controller.handleGetResponse(res, user);
            } catch (error) {
                res.status(StatusCodes.NOT_FOUND).send(error.message);
            }
        });

        this.router.put('/me', verifySessionToken, async (req: IRequest, res: Response) => {
            try {
                const userId = req.user.userId;
                const user: any = await this.userService.getDocumentById(userId, UserProjection.userAuth);
                if (!user) {
                    res.status(400).json({ message: 'Something went wrong, please try again later' });
                    return;
                }

                const userEdit = req.body as IUserRequest;
                const isPasswordValid = await bcrypt.compare(userEdit.password, user.password);
                if (!isPasswordValid) {
                    res.status(401).json({ message: 'Invalid password' });
                    return;
                }

                userEdit.newEmail = userEdit.newEmail?.toLowerCase();
                if (userEdit.newEmail && !validateEmail(userEdit.newEmail)) {
                    res.status(400).json({ message: 'Invalid email' });
                    return;
                }

                const finalUser = await this.userService.updateUser(userId, userEdit);
                Controller.handlePutResponse(res, finalUser);
            } catch (error) {
                res.status(StatusCodes.NOT_FOUND).send(error.message);
            }
        });

        this.router.post("/register", async (req: Request, res: Response) => {
            try {
                const { email, password } = req.body;
                const formattedEmail = email?.toLowerCase();
                if (!validateEmail(formattedEmail)) {
                    res.status(400).json({ message: 'Invalid email' });
                    return;
                }

                const existingUser = await this.userService.getDocumentByEmail(formattedEmail, UserProjection.userAuth);
                if (existingUser) {
                    res.status(400).json({ message: 'Email already exists' });
                    return;
                }

                const hashedPassword = await createHashedPassword(password);
                const newUser: any = await this.userService.createUser(formattedEmail, hashedPassword);
                const sessionToken = generateSessionToken(newUser._id);
                Controller.handlePostResponse(res, { id: newUser._id, sessionToken });
            } catch (error) {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error.message);
            }
        });

        this.router.get('/me/verify-account', verifySessionToken, async (req: IRequest, res: Response) => {
            try {
                const userId = req.user.userId;
                const user: any = await this.userService.getDocumentByIdLean(userId, UserProjection.userConfirm);
                if (!user) {
                    res.status(400).json({ message: 'Something went wrong, please try again later' });
                    return;
                }

                const token = crypto.randomBytes(20).toString('hex');
                const expirationTime = new Date();
                expirationTime.setHours(expirationTime.getHours() + 1);

                const userEdit = { verifyAccountToken: token, verifyAccountExpires: expirationTime };
                await this.userService.updateUserForce(user._id, userEdit);

                const verifyLink = `${process.env.BASE_URL}?confirmToken=${token}`;
                const mailOptions = {
                    to: user.email,
                    from: process.env.EMAIL_USERNAME,
                    template: 'verify-account',
                    subject: 'Unleashed AI Verify Account',
                    text: `Unleashed AI Verify Account Click on the link below to verify your account: ${verifyLink}`,
                    html: `<h1>Unleashed AI Verify Account</h1><p>Click <a href='${verifyLink}' target='_blank'>here</a> to verify your account</p>`,
                    context: { token },
                };

                mailTransporter.sendMail(mailOptions, (err: any) => {
                    if (err) {
                        res.status(400).send({ message: 'Cannot send verify account email' });
                        return;
                    }
                    Controller.handleHttpResponse(res, { message: 'You received an email, please verify your inbox and spam folder' });
                });
            } catch (error) {
                res.status(StatusCodes.NOT_FOUND).send(error.message);
            }
        });

        this.router.post("/:userId/verify-account", async (req: Request, res: Response) => {
            try {
                const userId = decodeURIComponent(req.params.userId);
                const { token } = req.body;

                const user: any = await this.userService.getDocumentByIdLean(userId, UserProjection.userConfirm);
                if (!user) {
                    res.status(400).json({ message: 'User does not exist' });
                    return;
                }

                if (user.isVerified) {
                    Controller.handleHttpResponse(res, { message: 'Your account has been successfully verified' });
                    return;
                }

                if (token !== user.verifyAccountToken) {
                    res.status(400).send({ message: 'Something went wrong, please try again later' });
                    return;
                }

                const currentTime = new Date();
                if (currentTime > user.verifyAccountExpires) {
                    res.status(400).send({ message: 'Account verification time limit expired' });
                    return;
                }

                const userEdit = { isVerified: true, verifyAccountToken: '', verifyAccountExpires: currentTime };
                await this.userService.updateUserForce(user._id, userEdit);

                Controller.handleHttpResponse(res, { message: 'Your account has been successfully verified' });
            } catch (error) {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error.message);
            }
        });

        this.router.post("/login", async (req: Request, res: Response) => {
            try {
                const { email, password } = req.body;
                const formattedEmail = email?.toLowerCase();
                if (!validateEmail(formattedEmail)) {
                    res.status(400).json({ message: 'Invalid email or password' });
                    return;
                }

                const user: any = await this.userService.getDocumentByEmail(formattedEmail, UserProjection.userAuth);
                if (!user) {
                    res.status(401).json({ message: 'Invalid email or password' });
                    return;
                }

                const isPasswordValid = await bcrypt.compare(password, user.password);
                if (!isPasswordValid) {
                    res.status(401).json({ message: 'Invalid email or password' });
                    return;
                }

                const sessionToken = generateSessionToken(user._id);
                Controller.handleGetResponse(res, { id: user._id, sessionToken });
            } catch (error) {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error.message);
            }
        });

        this.router.post("/forgot-password", async (req: Request, res: Response) => {
            try {
                const { email } = req.body;
                const formattedEmail = email?.toLowerCase();
                if (!validateEmail(formattedEmail)) {
                    res.status(400).json({ message: 'Invalid email' });
                    return;
                }

                const user: any = await this.userService.getDocumentByEmail(formattedEmail, UserProjection.userAuth);
                if (!user) {
                    res.status(400).json({ message: 'Email does not exist' });
                    return;
                }

                const token = crypto.randomBytes(20).toString('hex');
                const expirationTime = new Date();
                expirationTime.setHours(expirationTime.getHours() + 1);

                const userEdit = { passwordResetToken: token, passwordResetExpires: expirationTime };
                await this.userService.updateUserForce(user._id, userEdit);

                const resetLink = `${process.env.BASE_URL}/login?resetToken=${token}`;
                const mailOptions = {
                    to: email,
                    from: process.env.EMAIL_USERNAME,
                    template: 'forgot-password',
                    subject: 'Unleashed AI Password Reset',
                    text: `Unleashed AI Password Reset Click on the link below to reset your password: ${resetLink}`,
                    html: `<h1>Unleashed AI Password Reset</h1><p>Click <a href='${resetLink}' target='_blank'>here</a> to reset your password</p>`,
                    context: { token },
                };

                mailTransporter.sendMail(mailOptions, (err: any) => {
                    if (err) {
                        res.status(400).send({ message: 'Cannot send forgot password email' });
                        return;
                    }
                    Controller.handleHttpResponse(res, { message: 'You received an email, please verify your inbox and spam folder' });
                });

            } catch (error) {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error.message);
            }
        });

        this.router.post("/reset-password", async (req: Request, res: Response) => {
            try {
                const { email, token, password } = req.body;
                const formattedEmail = email?.toLowerCase();
                if (!validateEmail(formattedEmail)) {
                    res.status(400).json({ message: 'Invalid email' });
                    return;
                }

                const user: any = await this.userService.getDocumentByEmail(formattedEmail, UserProjection.userAuth);
                if (!user) {
                    res.status(400).json({ message: 'Email does not exist' });
                    return;
                }

                if (token !== user.passwordResetToken) {
                    res.status(400).send({ message: 'Something went wrong, please try again later' });
                    return;
                }

                const currentTime = new Date();
                if (currentTime > user.passwordResetExpires) {
                    res.status(400).send({ message: 'Reset password time limit expired' });
                    return;
                }

                const userEdit = { password: password, passwordResetToken: '', passwordResetExpires: currentTime };
                const finalUser = await this.userService.updateUserForce(user._id, userEdit);
                const sessionToken = generateSessionToken(finalUser._id);

                Controller.handleHttpResponse(res, { id: finalUser._id, sessionToken });
            } catch (error) {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error.message);
            }
        });

        this.router.post("/guests", async (req, res) => {
            try {
                const user = await this.userService.createGuest();
                const userDto = Converter.objectToProjected(user, UserProjection.user);
                const sessionToken = generateSessionToken(userDto._id);
                Controller.handlePostResponse(res, { id: userDto._id, sessionToken });
            } catch (error) {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error.message);
            }
        });

        this.router.get('/', verifyAdminSessionToken, async (req: Request, res: Response) => {
            try {
                res.status(StatusCodes.OK).send('Server working');
            } catch (error) {
                res.status(StatusCodes.NOT_FOUND).send(error.message);
            }
        });

        this.router.get('/:userId', verifyAdminSessionToken, async (req: Request, res: Response) => {
            try {
                const userId = decodeURIComponent(req.params.userId);
                const user = await this.userService.getDocumentByIdLean(userId, UserProjection.user);
                Controller.handleGetResponse(res, user);
            } catch (error) {
                res.status(StatusCodes.NOT_FOUND).send(error.message);
            }
        });

        this.router.get('/email/:email', verifyAdminSessionToken, async (req: Request, res: Response) => {
            try {
                const email = decodeURIComponent(req.params.email)?.toLowerCase();
                const user = await this.userService.getDocumentByEmail(email, UserProjection.user);
                Controller.handleGetResponse(res, user);
            } catch (error) {
                res.status(StatusCodes.NOT_FOUND).send(error.message);
            }
        });
    }
}
