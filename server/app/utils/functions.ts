import * as bcrypt from 'bcrypt';
const crypto = require('crypto');

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

export function signCookie(url: string) {
    const keyName = process.env.SIGNING_KEY_NAME ?? ''; // Your signing key name
    const key = process.env.SIGNING_KEY ?? ''; // Your signing key
    const encodedUrl = btoa(url);
    const expirationTimestamp = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now
    const policy = `URLPrefix=${encodedUrl}:Expires=${expirationTimestamp}:KeyName=${keyName}`;
    const signature = getSignatureForUrl(key, policy);

    const cookieValue = `${policy}:Signature=${signature}`;
    const domain = 'unleashedai.org';
    const path = '/';

    const setCookieValue = `Cloud-CDN-Cookie=${cookieValue}; Domain=${domain}; Path=${path}; SameSite=None; HttpOnly; Secure;`;
    console.log('setCookieValue', setCookieValue);

    return setCookieValue;
}

function getSignatureForUrl(key: string, policy: string) {
    const decodedKey = Buffer.from(key, 'base64');
    const hmac = crypto.createHmac('sha1', decodedKey);
    hmac.update(policy);
    const digest = hmac.digest();
    const signature = Buffer.from(digest).toString('base64url');

    return signature;
}