import jwt from 'jsonwebtoken';
import { IConfigService } from '../config/config.service.interface';
import { TYPES } from '../types';
import { ITokenSchema, TokenModel } from './token.model';
import { inject, injectable } from 'inversify';
import {
	IGeneratedTokens,
	ITokenService,
	Payload,
} from './token.service.interface';
import { UserDto } from '../user/DTO/user.dto';

@injectable()
export class TokenService implements ITokenService {
	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService,
		private tokenModel = TokenModel,
	) {}
	generateTokens(payload: Payload): IGeneratedTokens {
		const accessToken = jwt.sign(
			payload,
			this.configService.get('JWT_ACCESS_SECRET'),
			{
				expiresIn: '15s',
			},
		);
		const refreshToken = jwt.sign(
			payload,
			this.configService.get('JWT_REFRESH_SECRET'),
			{
				expiresIn: '30s',
			},
		);
		return {
			accessToken,
			refreshToken,
		};
	}
	/*

	validateAccessToken(token) {
		try {
			const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
			return userData;
		} catch (e) {
			return null;
		}
	}

	validateRefreshToken(token) {
		try {
			const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
			return userData;
		} catch (e) {
			return null;
		}
	}
	*/
	async saveToken(userId: string, refreshToken: string): Promise<ITokenSchema> {
		const tokenData = await this.tokenModel.findOne({ user: userId });
		if (tokenData) {
			tokenData.refreshToken = refreshToken;
			return tokenData.save();
		}
		const token = await this.tokenModel.create({ user: userId, refreshToken });
		return token;
	}

	async removeToken(refreshToken: string): Promise<void> {
		const query = await this.tokenModel.deleteOne({ refreshToken });
	}
	/*
	async findToken(refreshToken) {
		const tokenData = await tokenModel.findOne({ refreshToken });
		return tokenData;
	}
	*/
}
