import { JwtPayload } from 'jsonwebtoken';
import { ITokenSchema } from './token.model';

export interface ITokenService {
	generateTokens: (payload: Payload) => IGeneratedTokens;
	removeToken: (tokem: string) => Promise<void>;
	saveToken: (userId: string, refreshToken: string) => Promise<ITokenSchema>;
}

export type Payload = string | Buffer | object;

export interface IGeneratedTokens {
	accessToken: string;
	refreshToken: string;
}
