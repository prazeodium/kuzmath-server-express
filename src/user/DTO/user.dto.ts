import { Model } from 'mongoose';
import { UserModel, IUserSchema } from '../user.model';

export class UserDto {
	email: string;
	id: string;
	isActivated: boolean;

	constructor(model: IUserSchema) {
		this.email = model.email;
		this.id = model._id;
		this.isActivated = model.isActivated;
	}
}
