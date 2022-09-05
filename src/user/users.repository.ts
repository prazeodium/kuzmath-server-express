import { injectable } from 'inversify';
import { User } from './user.entity';
import { IUserSchema, UserModel } from './user.model';
import { IUserRepository } from './users.repository.interface';

@injectable()
export class UserRepository implements IUserRepository {
	constructor(private userModel = UserModel) {}

	async create({
		email,
		password,
		name,
		activationLink,
	}: User): Promise<IUserSchema> {
		return this.userModel.create({ email, password, name, activationLink });
	}

	async findOne(conditions: object): Promise<IUserSchema | null> {
		return this.userModel.findOne(conditions);
	}
}
