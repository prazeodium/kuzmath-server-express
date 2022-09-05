import { injectable, inject } from 'inversify';
import mongoose, { Mongoose } from 'mongoose';
import { IConfigService } from '../config/config.service.interface';
import { ILoggerService } from '../logger/logger.interface';
import { TYPES } from '../types';

@injectable()
export class MongoService {
	public client: Mongoose;

	constructor(
		@inject(TYPES.LoggerService) private logger: ILoggerService,
		@inject(TYPES.ConfigService) private configService: IConfigService,
	) {
		this.client = mongoose;
	}

	async connect(): Promise<void> {
		const DB_LOGIN = this.configService.get('MONGODB_LOGIN');
		const DB_PASS = this.configService.get('MONGODB_PASS');
		const URI = `mongodb+srv://${DB_LOGIN}:${DB_PASS}@cluster0.ikkjly6.mongodb.net/?retryWrites=true&w=majority`;
		try {
			await this.client.connect(URI);
			this.logger.log('[MongoService] Подключена база данных');
		} catch (error) {
			if (error instanceof Error) {
				this.logger.log('[MongoService] Ошибка подключения к базе данных');
			}
		}
	}

	async disconnect(): Promise<void> {
		await this.client.disconnect();
	}
}
