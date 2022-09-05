import { Document, model, Schema } from 'mongoose';

export interface ITokenSchema extends Document {
	user: Schema.Types.ObjectId;
	refreshToken: string;
}

const TokenSchema: Schema<ITokenSchema> = new Schema({
	user: { type: Schema.Types.ObjectId, ref: 'User' },
	refreshToken: { type: String, required: true },
});

export const TokenModel = model<ITokenSchema>('Token', TokenSchema);
