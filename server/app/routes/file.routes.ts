import { Router, Request, Response } from 'express';
import multer = require('multer');
import { v4 as uuidv4 } from 'uuid';
import File from '../models/file.model';
// import FileService from '@app/services/file.service';
import { Service } from 'typedi';

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

    constructor() {
        this.configureRouter();
    }

    private configureRouter() {
        this.router = Router();

        // Upload file endpoint
        this.router.post('/upload', upload.single('file'), async (req: Request, res: Response) => {
            try {
                if (!req.file) {
                    res.status(400).send('No file uploaded');
                    return;
                }

                const { filename, originalname, mimetype, path, size } = req.file;
                const file = new File({
                    name: filename,
                    originalName: originalname,
                    mimetype,
                    path,
                    size,
                });
                await file.save();
                res.json({ message: 'File uploaded successfully' });
            } catch (error) {
                res.status(500).json({ error: 'Failed to upload file' });
            }
        });

        // Download file endpoint
        this.router.get('/download/:id', async (req: Request, res: Response) => {
            try {
                const fileId = req.params.id;
                const file = await File.findById(fileId);
                if (!file) {
                    res.status(404).json({ error: 'File not found' });
                }
                else {
                    res.download(file.path); // Download the file
                    // res.json({ message: 'File downloaded successfully' });
                }
            } catch (error) {
                res.status(500).json({ error: 'Failed to download file' });
            }
        });
        
    }
}

