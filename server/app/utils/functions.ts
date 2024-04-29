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

export function signCookie() {
    const keyName = 'unleashedai-cdn-sk00'; // Your signing key name
    const base64UrlEncodedUrlOrPrefix = 'aHR0cHM6Ly9jZG4udW5sZWFzaGVkYWkub3JnL3VzZXJzLzAwLw=='; // Base64 URL encoded URL or prefix of your bucket
    const signingKey = process.env.SIGNING_KEY ?? ''; // Your signing key
    const expirationTimestamp = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now

    // Create the unsigned policy string
    const unsignedPolicy = `URLPrefix=${base64UrlEncodedUrlOrPrefix}:Expires=${expirationTimestamp}:KeyName=${keyName}`;

    // Sign the policy using HMAC-SHA-1 with the signing key
    const signature = crypto.createHmac('sha1', signingKey)
        .update(unsignedPolicy)
        .digest('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, ''); // URL-safe Base64 encode the signature

    // Create the cookie value
    const cookieValue = `${unsignedPolicy}:Signature=${signature}`;

    // Example: Effective domain and path where the cookie should be sent
    const domain = 'unleashedai.org';
    const path = '/';

    // Create Set-Cookie header value
    const setCookieValue = `Cloud-CDN-Cookie=${cookieValue}; Domain=${domain}; Path=${path}; Expires=${new Date(expirationTimestamp * 1000).toUTCString()}; HttpOnly`;
    return setCookieValue;
}
