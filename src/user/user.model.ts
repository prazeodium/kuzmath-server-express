import { Schema, model, Model, Document } from 'mongoose';

export interface IUserSchema extends Document {
	email: string;
	name: string;
	password: string;
	isActivated: boolean;
	activationLink: string;
}

const UserSchema: Schema<IUserSchema> = new Schema({
	email: {
		type: String,
		unique: true,
		reqiured: true,
	},
	password: {
		type: String,
		required: true,
	},
	name: {
		type: String,
	},
	isActivated: {
		type: Boolean,
		default: false,
	},
	activationLink: {
		type: String,
	},
});

export const UserModel = model<IUserSchema>('User', UserSchema);

// export interface IUserModel extends Model<IUserSchema> {
// 	save(person: string): string;
// }
