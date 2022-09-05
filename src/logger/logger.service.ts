import { injectable } from 'inversify';
import 'reflect-metadata';
import { Logger } from 'tslog';
import { ILoggerService } from './logger.interface';

@injectable()
export class LoggerService implements ILoggerService {
	logger: Logger;

	constructor() {
		this.logger = new Logger({
			displayLoggerName: false,
			displayInstanceName: false,
			displayFilePath: 'hidden',
			displayFunctionName: false,
		});
	}

	log(...args: unknown[]): void {
		this.logger.info(...args);
	}

	error(...args: unknown[]): void {
		this.logger.error(...args);
	}

	warn(...args: unknown[]): void {
		this.logger.warn(...args);
	}
}
