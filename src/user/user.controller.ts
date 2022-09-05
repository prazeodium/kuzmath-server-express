import { BaseController } from '../common/base.controller';
import { Request, Response, NextFunction } from 'express';
import { HTTPError } from '../error/http.error';
import { injectable, inject } from 'inversify';
import 'reflect-metadata';
import { TYPES } from '../types';
import { ILoggerService } from '../logger/logger.interface';
import { IUserController } from './user.controller.interface';
import { UserLoginDTO } from './DTO/user.login.dto';
import { UserRegisterDTO } from './DTO/user.register.dto';
import { ValidateMiddleware } from '../common/validate.middleware';
import { UserService } from './user.service';
import { IConfigService } from '../config/config.service.interface';

@injectable()
export class UserController extends BaseController implements IUserController {
	constructor(
		@inject(TYPES.LoggerService) private logger: ILoggerService,
		@inject(TYPES.UserService) private userService: UserService,
		@inject(TYPES.ConfigService) private configService: IConfigService,
	) {
		super(logger);
		this.bindRoutes([
			{
				path: '/register',
				method: 'post',
				handler: this.register,
				middlewares: [
					new ValidateMiddleware(UserRegisterDTO, {
						validationError: { target: false, value: false },
					}),
				],
			},
			{
				path: '/login',
				method: 'post',
				handler: this.login,
				middlewares: [
					new ValidateMiddleware(UserLoginDTO, {
						validationError: { target: false, value: false },
					}),
				],
			},
			{ path: '/activate/:link', method: 'get', handler: this.activate },
			{ path: '/logout', method: 'post', handler: this.logout },
		]);
	}

	async activate(
		{ params }: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const activationLink = params.link;
			await this.userService.activate(activationLink);
			return res.redirect(this.configService.get('CLIENT_URL'));
		} catch (error) {
			next(error);
		}
	}

	async login(
		{ body }: Request<{}, {}, UserLoginDTO>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const userData = await this.userService.login(body);
			res.cookie('refreshToken', userData.refreshToken, {
				maxAge: 30 * 24 * 60 * 60 * 1000,
				httpOnly: true,
			});

			this.ok(res, userData.user);
		} catch (error) {
			next(error);
		}
	}

	async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { refreshToken } = req.cookies;
			const token = await this.userService.logout(refreshToken);

			res.clearCookie('refreshToken');
			this.ok(res, 'Вы успешно вышли.');
		} catch (e) {
			next(e);
		}
	}

	async register(
		{ body }: Request<{}, {}, UserRegisterDTO>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const createdUser = await this.userService.createUser(body);
			if (!createdUser) {
				return next(new HTTPError(422, 'Такой пользователь уже существует'));
			}
			res.cookie('refreshToken', createdUser.refreshToken, {
				maxAge: 30 * 24 * 60 * 60 * 1000,
				httpOnly: true,
			});
			this.ok(res, createdUser.user);
		} catch (error) {
			next(error);
		}
	}
}
