import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import * as fs from 'fs';

import { CookieOptions } from 'express';

export function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export async function createHashedPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
}

export function getUnixTimeInMs(durationInDays: number) {
    const now = new Date();
    const millisecondsForSevenDays = durationInDays * 24 * 60 * 60 * 1000;
    const expireDate = new Date(now.getTime() + millisecondsForSevenDays);
    const expireUnixTimestamp = Math.floor(expireDate.getTime() / 1000);
    return expireUnixTimestamp;
}

export function getCookieOptions(): CookieOptions {
    let cookieOptions: CookieOptions = {
        httpOnly: true, // The cookie cannot be accessed or manipulated from the client-side JS
        path: '/', //  the cookie will only be sent by the browser when the user is visiting a page under the path (e.g., mysite.com/${path})
        sameSite: 'none', // The cookie will be sent with both same-site and cross-site requests since the request initiator's site (mysite.com) is different from the server's site (server.mysite.com)
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        domain: 'unleashedai.org'
    };

    return cookieOptions;
}

export function signCookie() {
    const urlPrefix = 'https://cdn.unleashedai.org/users/00/';
    const expiration = getUnixTimeInMs(1);
    const keyName = 'unleashedai-cdn-sk00';
    const keyFilePath = 'private/unleashedai-cdn-sk00.pem';
    
    // Read the key file (assuming the key is in base64 format)
    const base64Key = fs.readFileSync(keyFilePath, 'utf8');
    const key = Buffer.from(base64Key, 'base64');

    // Validate URL Prefix
    try {
        const parsedUrl = new URL(urlPrefix);
        if (!parsedUrl.protocol.startsWith('http')) {
            throw new Error('urlPrefix must start with either http:// or https://');
        }
        if (parsedUrl.search) {
            throw new Error('urlPrefix must not include query parameters');
        }
    } catch (e) {
        throw new Error(`urlPrefix malformed or invalid URL: ${urlPrefix}`);
    }

    // Encode the URL Prefix
    const encodedUrlPrefix = Buffer.from(urlPrefix).toString('base64url');

    const policy = `URLPrefix=${encodedUrlPrefix}:Expires=${expiration}:KeyName=${keyName}`;
    const signature = getSignatureForUrl(key, policy);

    const cookieInfo = {
        policy, signature
    };

    return cookieInfo;
}

export function getSignatureForUrl(privateKey: Buffer, input: string): string {
    const hmac = crypto.createHmac('sha1', privateKey);
    hmac.update(input);
    const signature = hmac.digest('base64url');

    return signature;
}