import { Router, Response } from 'express';
import { IControllerRoute } from './router.interface';
import { injectable } from 'inversify';
import 'reflect-metadata';
import { ILoggerService } from '../logger/logger.interface';

@injectable()
export abstract class BaseController {
	private readonly _router: Router;

	constructor(private loggerService: ILoggerService) {
		this._router = Router();
	}

	get router(): Router {
		return this._router;
	}

	public send<T>(res: Response, code: number, message: T): Response {
		res.type('application/json');
		return res.status(code).json(message);
	}

	public ok<T>(res: Response, message: T): Response {
		return this.send<T>(res, 200, message);
	}

	public created(res: Response): Response {
		return res.sendStatus(201);
	}

	protected bindRoutes(routes: IControllerRoute[]): void {
		for (const route of routes) {
			this.loggerService.log(`[${route.method}] ${route.path}`);
			const middleware = route.middlewares?.map((m) => m.execute.bind(m));
			const handler = route.handler.bind(this);
			const pipeline = middleware ? [...middleware, handler] : handler;
			this.router[route.method](route.path, pipeline);
		}
	}
}
