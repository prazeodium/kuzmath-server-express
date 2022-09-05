import { User } from './user.entity';
import { IUserSchema } from './user.model';

export interface IUserRepository {
	create: (user: User) => Promise<IUserSchema>;
	findOne: (conditions: object) => Promise<IUserSchema | null>;
}
