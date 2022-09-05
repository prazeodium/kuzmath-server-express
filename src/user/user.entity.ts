import { compare, hash } from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

export class User {
	password: string;
	activationLink: string;
	isActivated: boolean;

	constructor(readonly email: string, readonly name: string) {
		this.isActivated = false;
	}

	public async comparePassword(hashedPassword: string): Promise<boolean> {
		return compare(this.password, hashedPassword);
	}

	public async setPassword(pass: string, salt: number): Promise<void> {
		try {
			this.password = await hash(pass, salt);
		} catch (error) {
			console.error(error);
		}
	}

	public setActivationLink(): void {
		this.activationLink = uuidv4();
	}
}
