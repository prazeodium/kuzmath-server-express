import { config, DotenvConfigOutput, DotenvParseOutput } from 'dotenv';
import { inject, injectable } from 'inversify';
import { ILoggerService } from '../logger/logger.interface';
import { TYPES } from '../types';
import { IConfigService } from './config.service.interface';

@injectable()
export class ConfigService implements IConfigService {
	private config: DotenvParseOutput;

	constructor(@inject(TYPES.LoggerService) private logger: ILoggerService) {
		const result: DotenvConfigOutput = config();
		if (result.error) {
			this.logger.error(
				'[ConfigService] Не удалось прочитать файл конфигурации .env',
			);
		} else {
			this.logger.log('[ConfigService] Конфигурация .env загружена');
			this.config = result.parsed as DotenvParseOutput;
		}
	}

	get(key: string): string {
		return this.config[key];
	}
}
