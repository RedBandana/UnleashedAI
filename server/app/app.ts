import { HttpException } from '@app/classes/http.exception';
import 'dotenv/config';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as express from 'express';
import { StatusCodes } from 'http-status-codes';
import * as logger from 'morgan';
import * as swaggerJSDoc from 'swagger-jsdoc';
import * as swaggerUi from 'swagger-ui-express';
import { Service } from 'typedi';
import { FileController } from './controllers/file.controller';
import { UserController } from './controllers/user.controller';

import mongoose from 'mongoose';
import { DBCollection } from './enums/db-collection';

// to prepare for the default value of strictQuery to false on mongoose 7
mongoose.set('strictQuery', false);

@Service()
export class Application {
    app: express.Application;
    private internalError: number;
    private readonly swaggerOptions: swaggerJSDoc.Options;

    constructor(
        private fileController: FileController, private userController: UserController
    ) {
        this.internalError = StatusCodes.INTERNAL_SERVER_ERROR;
        this.app = express();

        this.swaggerOptions = {
            swaggerDefinition: {
                openapi: '3.0.0',
                info: {
                    title: 'Cadriciel Serveur',
                    version: '1.0.0',
                },
            },
            apis: ['**/*.ts'],
        };

        this.config();

        this.bindRoutes();
    }

    bindRoutes() {
        this.app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerJSDoc(this.swaggerOptions)));
        this.app.use(`/api/${DBCollection.USER}`, this.userController.router);
        this.app.use(`/api/${DBCollection.FILE}`, this.fileController.router);

        this.errorHandling();
    }

    private config() {
        this.app.use(cors());

        // Middlewares configuration
        this.app.use(logger('dev'));

        // for parsing
        this.app.use(express.json({ limit: '10mb' }));
        this.app.use(express.urlencoded({ limit: '10mb', extended: true }));
        this.app.use(express.text({ limit: '10mb' }));

        this.app.use(cookieParser());
    }

    private errorHandling() {
        // When previous handlers have not served a request: path wasn't found
        this.app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
            const err: HttpException = new HttpException('Not Found');
            next(err);
        });

        // development error handler
        // will print stacktrace
        if (this.app.get('env') === 'development') {
            this.app.use((err: HttpException, req: express.Request, res: express.Response) => {
                res.status(err.status || this.internalError);
                res.send({
                    message: err.message,
                    error: err,
                });
            });
        }

        // production error handler
        // no stacktraces leaked to user (in production env only)
        this.app.use((err: HttpException, req: express.Request, res: express.Response) => {
            res.status(err.status || this.internalError);
            res.send({
                message: err.message,
                error: {},
            });
        });
    }
}
