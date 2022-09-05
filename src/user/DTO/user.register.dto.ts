import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class UserRegisterDTO {
	@IsEmail({}, { message: 'Неверный email' })
	email: string;

	@IsString({ message: 'Не указан пароль' })
	@MinLength(8, { message: 'Длина пароля должна быть не меньше 8 символов' })
	@MaxLength(50, { message: 'Длина пароля должна быть не более 50 символов' })
	password: string;

	@IsString({ message: 'Не указано имя' })
	name: string;
}
