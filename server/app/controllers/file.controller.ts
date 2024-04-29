import { FileService } from '@app/services/file.service';
import { Router, Response, Request } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Service } from 'typedi';
import { v4 as uuidv4 } from 'uuid';
import multer = require('multer');
import { FileProjection, IFile } from '@app/db-models/file';
import { verifyAdminSessionToken } from './authentication';
import { getCookieOptions, signCookie } from '@app/utils/functions';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads'); // Set the destination folder for uploaded files
    },
    filename: (req, file, cb) => {
        const uniqueFileName = `${uuidv4()}-${file.originalname}`;
        cb(null, uniqueFileName); // Set the uploaded file's name
    },
});

const upload = multer({ storage });

@Service()
export class FileController {
    router: Router;

    constructor(private fileService: FileService) {
        this.configureRouter();
    }

    private configureRouter() {
        this.router = Router();

        this.router.get('/sign', async (req: Request, res: Response) => {
            try {
                const cookieOptions = getCookieOptions();
                const cookieInfo = signCookie();
                console.log('policy', cookieInfo.policy);
                console.log('signature', cookieInfo.signature);
                
                res.cookie('Cloud-CDN-Cookie', cookieInfo.policy, cookieOptions);
                res.cookie('Signature', cookieInfo.signature, cookieOptions);
                res.status(StatusCodes.OK).send('Cookie signed');
            } catch (error) {
                res.status(StatusCodes.NOT_FOUND).send(error.message);
            }
        });

        this.router.get('/', verifyAdminSessionToken, async (req: Request, res: Response) => {
            try {
                res.status(StatusCodes.OK).send('Server working');
            } catch (error) {
                res.status(StatusCodes.NOT_FOUND).send(error.message);
            }
        });

        this.router.get('/:id', verifyAdminSessionToken, async (req: Request, res: Response) => {
            const id = decodeURIComponent(req.params.id);

            try {
                const file = await this.fileService.getDocumentByIdLean(id, FileProjection.file) as IFile;
                if (file) {
                    res.status(StatusCodes.OK).send(file);
                }
            } catch (error) {
                res.status(StatusCodes.NOT_FOUND).send(error.message);
            }
        });

        this.router.get('/download/:id', verifyAdminSessionToken, async (req: Request, res: Response) => {
            const id = decodeURIComponent(req.params.id);

            try {
                const file = await this.fileService.getDocumentByIdLean(id, FileProjection.file) as IFile;
                if (file) {
                    res.download(file.path);
                }
            } catch (error) {
                res.status(StatusCodes.NOT_FOUND).send(error.message);
            }
        });

        this.router.post('/upload', verifyAdminSessionToken, upload.single('file'), async (req: Request, res: Response) => {
            try {
                const file = req.file;
                if (!file) {
                    res.status(StatusCodes.BAD_REQUEST).send('No file uploaded');
                    return;
                }
                const uploadedFile = await this.fileService.uploadFile(file);
                res.status(StatusCodes.CREATED).json(uploadedFile._id);
            } catch (error) {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error.message);
            }
        });

        this.router.delete('/delete/:id', verifyAdminSessionToken, async (req: Request, res: Response) => {
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
