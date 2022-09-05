import { ExeptionFilter } from './error/exeption.filter';
import { IExeptionFilter } from './error/exeption.filter.interface';
import { ILoggerService } from './logger/logger.interface';
import { LoggerService } from './logger/logger.service';
import { UserController } from './user/user.controller';
import App from './app';
import { Container } from 'inversify';
import { TYPES } from './types';
import { IUserController } from './user/user.controller.interface';
import { IUserService } from './user/user.service.interface';
import { UserService } from './user/user.service';
import { IConfigService } from './config/config.service.interface';
import { ConfigService } from './config/config.service';
import { MongoService } from './database/mongo.service';
import { UserRepository } from './user/users.repository';
import { IUserRepository } from './user/users.repository.interface';
import { TokenService } from './token/token.service';
import { ITokenService } from './token/token.service.interface';
import { MailService } from './mail/mail.service';
import { IMailService } from './mail/mail.service.interface';

const appContainer = new Container();
appContainer
	.bind<ILoggerService>(TYPES.LoggerService)
	.to(LoggerService)
	.inSingletonScope();
appContainer.bind<IExeptionFilter>(TYPES.ExeptionFilter).to(ExeptionFilter);
appContainer.bind<IUserController>(TYPES.UserController).to(UserController);
appContainer.bind<IUserService>(TYPES.UserService).to(UserService);
appContainer
	.bind<IConfigService>(TYPES.ConfigService)
	.to(ConfigService)
	.inSingletonScope();
appContainer
	.bind<MongoService>(TYPES.MongoService)
	.to(MongoService)
	.inSingletonScope();
appContainer.bind<App>(TYPES.Application).to(App);
appContainer.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);
appContainer.bind<ITokenService>(TYPES.TokenService).to(TokenService);
appContainer
	.bind<IMailService>(TYPES.MailService)
	.to(MailService)
	.inSingletonScope();

export { appContainer };
