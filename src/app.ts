import express, { Express, json } from 'express';
import cookieParser from 'cookie-parser';
import { Server } from 'http';
import { injectable, inject } from 'inversify';
import 'reflect-metadata';
import { ILoggerService } from './logger/logger.interface';
import { TYPES } from './types';
import { IConfigService } from './config/config.service.interface';
import { IExeptionFilter } from './error/exeption.filter.interface';
import { UserController } from './user/user.controller';
import { MongoService } from './database/mongo.service';

@injectable()
export default class App {
	app: Express;
	server: Server;
	PORT: number;

	constructor(
		@inject(TYPES.LoggerService) private logger: ILoggerService,
		@inject(TYPES.UserController) private userController: UserController,
		@inject(TYPES.ExeptionFilter) private exeptionFilter: IExeptionFilter,
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.MongoService) private database: MongoService,
	) {
		this.app = express();
		this.PORT = 8000;
	}

	useRoutes(): void {
		this.app.use('/users', this.userController.router);
	}

	useExeptionFilters(): void {
		this.app.use(this.exeptionFilter.catch.bind(this.exeptionFilter));
	}

	useMiddleware(): void {
		this.app.use(json());
		this.app.use(cookieParser());
	}

	public async init(): Promise<void> {
		this.useMiddleware();
		this.useRoutes();
		this.useExeptionFilters();
		await this.database.connect();
		this.server = this.app.listen(this.PORT);
		this.logger.log(`[App] Сервер запущен на http://localhost:${this.PORT}`);
	}
}
