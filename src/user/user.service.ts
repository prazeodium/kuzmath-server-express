import { inject, injectable } from 'inversify';
import { IConfigService } from '../config/config.service.interface';
import { TYPES } from '../types';
import { UserDto } from './DTO/user.dto';
import { User } from './user.entity';
import { UserLoginDTO } from './DTO/user.login.dto';
import { UserRegisterDTO } from './DTO/user.register.dto';
import { CreatedUser, IUserService } from './user.service.interface';
import { IUserRepository } from './users.repository.interface';
import { ITokenService } from '../token/token.service.interface';
import { MailService } from '../mail/mail.service';
import { HTTPError } from '../error/http.error';
import { compare } from 'bcrypt';

@injectable()
export class UserService implements IUserService {
	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.UserRepository) private userRepository: IUserRepository,
		@inject(TYPES.TokenService) private tokenService: ITokenService,
		@inject(TYPES.MailService) private mailService: MailService,
	) {}
	async createUser({
		email,
		name,
		password,
	}: UserRegisterDTO): Promise<CreatedUser | null> {
		const existedUser = await this.userRepository.findOne({ email });

		if (existedUser) {
			return null;
		}
		const newUser = new User(email, name);
		const salt = Number(this.configService.get('SALT'));
		newUser.setActivationLink();
		await newUser.setPassword(password, salt);

		const user = await this.userRepository.create(newUser);

		await this.mailService.sendActivationMail(
			email,
			`${process.env.API_URL}/users/activate/${newUser.activationLink}`,
		);

		const userDTO = new UserDto(user);
		const tokens = this.tokenService.generateTokens({ ...userDTO });

		await this.tokenService.saveToken(userDTO.id, tokens.refreshToken);
		return { ...tokens, user: userDTO };
	}

	async activate(activationLink: string): Promise<void> {
		const user = await this.userRepository.findOne({ activationLink });
		if (!user) {
			throw new HTTPError(404, 'Неккоректная ссылка активации', 'activate');
		}
		if (user.isActivated) {
			throw new HTTPError(400, 'Пользователь уже активирован', 'activate');
		}
		user.isActivated = true;
		await user.save();
	}

	async login({ email, password }: UserLoginDTO): Promise<CreatedUser> {
		const existedUser = await this.userRepository.findOne({ email });
		if (!existedUser) {
			throw new HTTPError(
				401,
				'Пользователь с таким email не найден.',
				'login',
			);
		}
		const isPassEqual = compare(password, existedUser.password);
		if (!isPassEqual) {
			throw new HTTPError(401, 'Введен неверный пароль', 'login');
		}

		const userDTO = new UserDto(existedUser);
		const tokens = this.tokenService.generateTokens({ userDTO });
		await this.tokenService.saveToken(userDTO.id, tokens.refreshToken);
		return { ...tokens, user: userDTO };
	}

	async logout(refreshToken: string): Promise<void> {
		await this.tokenService.removeToken(refreshToken);
	}
}
