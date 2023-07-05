import { FileService } from '@app/services/file.service';
import { Router, Response, Request } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Service } from 'typedi';
import multer = require('multer');
import { File } from '@app/db-models/file';
import path = require('path');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

@Service()
export class FileController {
    router: Router;
    upload: multer.Multer;

    constructor(private fileService: FileService) {
        this.configureRouter();
    }

    private configureRouter() {
        this.router = Router();

        this.router.get('/', async (req: Request, res: Response) => {
            try {
                const files = await this.fileService.getAll();
                res.status(StatusCodes.OK).json(files);
            } catch (error) {
                res.status(StatusCodes.NOT_FOUND).send(error.message);
            }
        });

        this.router.get('/:id', async (req: Request, res: Response) => {
            const id = decodeURIComponent(req.params.id);

            try {
                console.log('test');
                const file = await this.fileService.getOneDocumentFullInfo(id) as File;
                if (file) {
                    console.log(file);
                    console.log('File MimeType:', file.mimeType);
                    res.setHeader('Content-Type', file.mimeType);
                    res.setHeader('Content-Disposition', `attachment; filename="${file.originalName}"`);
                    res.sendFile(file.path);
                    res.status(StatusCodes.OK).send(file);
                }
            } catch (error) {
                res.status(StatusCodes.NOT_FOUND).send(error.message);
            }
        });

        this.router.post('/', upload.single('file'), async (req: Request, res: Response) => {
            try {
                const file = req.file;
                if (!file) {
                    res.status(StatusCodes.BAD_REQUEST).send('No file uploaded');
                    return;
                }
                const uploadedFile = await this.fileService.uploadFile(file);
                res.status(StatusCodes.CREATED).json(uploadedFile);
            } catch (error) {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error.message);
            }
        });

        this.router.delete('/:id', async (req: Request, res: Response) => {
            const id = req.params.id;
            try {
                await this.fileService.deleteFile(id);
                res.sendStatus(StatusCodes.NO_CONTENT);
            } catch (error) {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error.message);
            }
        });
    }
}
