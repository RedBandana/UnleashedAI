
import * as nodemailer from 'nodemailer';
export const mailTransporter = nodemailer.createTransport({
    host: '127.0.0.1',
    port: 1025,
    secure: false,
    tls: {
        rejectUnauthorized: false
    },
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
    },
});