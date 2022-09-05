import { IGeneratedTokens } from '../token/token.service.interface';
import { UserDto } from './DTO/user.dto';
import { UserLoginDTO } from './DTO/user.login.dto';
import { UserRegisterDTO } from './DTO/user.register.dto';

export interface IUserService {
	activate: (activationLink: string) => Promise<void>;
	login: (dto: UserLoginDTO) => Promise<CreatedUser>;
	logout: (token: string) => Promise<void>;
	createUser: (dto: UserRegisterDTO) => Promise<CreatedUser | null>;
}

export type CreatedUser = {
	user: UserDto;
} & IGeneratedTokens;
