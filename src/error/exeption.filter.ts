import { NextFunction, Request, Response } from 'express';
import { IExeptionFilter } from './exeption.filter.interface';
import { HTTPError } from './http.error';
import 'reflect-metadata';
import { ILoggerService } from '../logger/logger.interface';
import { injectable, inject } from 'inversify';
import { TYPES } from '../types';

@injectable()
export class ExeptionFilter implements IExeptionFilter {
	constructor(@inject(TYPES.LoggerService) private logger: ILoggerService) {}

	catch(
		err: Error | HTTPError,
		req: Request,
		res: Response,
		next: NextFunction,
	): void {
		if (err instanceof HTTPError) {
			this.logger.error(
				`[${err.context}] Ошибка ${err.statusCode}: ${err.message}`,
			);
			res.send({
				context: err.context,
				code: err.statusCode,
				message: err.message,
			});
		} else {
			this.logger.error(`${err.message}`);
			res.status(500).send({ err: err.message });
		}
	}
}
