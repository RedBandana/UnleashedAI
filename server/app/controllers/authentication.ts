import { IRequest } from '@app/interfaces/request';
import { TOKEN_LIFESPAN } from '@app/utils/constants';
import { Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { VerifyErrors, verify, sign, decode } from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

const secretKey = process.env.JWT_SECRET || "e8mPgemZAtmThSwlF+0FXwlhuolmpvvLQmOmxHl4Ovxtkam0Tgdw+b/e5EfdodQX";
const unauthorizedTokens: { [key: string]: number } = {};

// Middleware to verify the session token
export function verifySessionToken(req: IRequest, res: Response, next: NextFunction): any {
  const sessionToken = req.headers.authorization?.split(' ')[1];
  if (!sessionToken) {
    return res.status(StatusCodes.UNAUTHORIZED).send('Session token is missing');
  }

  verify(sessionToken, secretKey, (err: VerifyErrors | null, decoded: any): any => {
    if (err || unauthorizedTokens[decoded.jti]) {
      return res.status(StatusCodes.UNAUTHORIZED).send('Invalid access token');
    }

    req.user = decoded;
    next();
  });

};

export function verifyAdminSessionToken(req: IRequest, res: Response, next: NextFunction): any {
  const sessionToken = req.headers.authorization?.split(' ')[1];
  if (!sessionToken) {
    return res.status(StatusCodes.UNAUTHORIZED).send('Session token is missing');
  }

  return res.status(StatusCodes.UNAUTHORIZED).send('Invalid access token');
}

export function generateSessionToken(userId: string) {
  const token = sign(
    { userId },
    secretKey,
    {
      expiresIn: `${TOKEN_LIFESPAN}d`,
      jwtid: new ObjectId().toString(),
    });
  return token;
};

export function invalidateSessionToken(token: string) {
  const decodedToken: any = decode(token);
  if (!decodedToken) {
    return;
  }

  unauthorizedTokens[decodedToken.jti] = decodedToken.exp;
};

export function removeExpiredTokens() {
  const currentTime = Math.floor(Date.now() / 1000);

  for (const tokenId in unauthorizedTokens) {
    if (unauthorizedTokens.hasOwnProperty(tokenId)) {
      const expirationTime = unauthorizedTokens[tokenId];

      if (currentTime > expirationTime) {
        delete unauthorizedTokens[tokenId];
      }
    }
  }
}