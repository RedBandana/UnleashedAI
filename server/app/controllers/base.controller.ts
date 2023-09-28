import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export class Controller {

    static handleHttpResponse(res: Response, item: any) {
        if (item) {
            res.status(StatusCodes.OK).send(item);
        } else {
            res.status(StatusCodes.BAD_REQUEST).send('Failed to post');
        }
    }

    static handleGetResponse(res: Response, itemToGet: any) {
        if (itemToGet) {
            res.status(StatusCodes.OK).send(itemToGet);
        } else {
            res.status(StatusCodes.NOT_FOUND).send('Failed to get');
        }
    }

    static handlePostResponse(res: Response, itemToPost: any) {
        if (itemToPost) {
            res.status(StatusCodes.CREATED).send(itemToPost);
        } else {
            res.status(StatusCodes.BAD_REQUEST).send('Failed to post');
        }
    }

    static handlePutResponse(res: Response, itemToPut: any) {
        if (itemToPut) {
            res.status(StatusCodes.OK).send(itemToPut);
        } else {
            res.status(StatusCodes.NOT_MODIFIED).send('Failed to put');
        }
    }

    static handleDeleteResponse(res: Response) {
        res.sendStatus(StatusCodes.NO_CONTENT);
    }
}