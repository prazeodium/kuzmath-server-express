import { inject, injectable } from 'inversify';
import nodemailer, {
	createTestAccount,
	createTransport,
	TestAccount,
} from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { IConfigService } from '../config/config.service.interface';
import { TYPES } from '../types';
import { IMailService } from './mail.service.interface';

@injectable()
export class MailService implements IMailService {
	private transporter: Mail;
	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService,
	) {
		this.initializeTransporter();
	}

	async sendActivationMail(to: string, link: string): Promise<void> {
		await this.transporter.sendMail({
			from: process.env.SMTP_USER,
			to,
			subject: 'Активация аккаунта на ' + this.configService.get('API_URL'),
			text: '',
			html: `
                    <div>
                        <h1>Для активации перейдите по ссылке</h1>
                        <a href="${link}">${link}</a>
                    </div>
                `,
		});
	}

	protected async initializeTransporter(): Promise<void> {
		if (this.transporter !== undefined) {
			return;
		}
		if (this.configService.get('MODE') === 'DEV') {
			this.transporter = createTransport({
				host: 'smtp.ethereal.email',
				port: 587,
				secure: false,
				auth: {
					user: 'ps5alt7w6e4cgmxo@ethereal.email',
					pass: 'bB52tj4vhEc4zhcgvm',
				},
			});
		} else {
			this.transporter = createTransport({
				host: this.configService.get('SMTP_HOST'),
				port: Number(this.configService.get('SMTP_PORT')),
				secure: false,
				auth: {
					user: this.configService.get('SMTP_USER'),
					pass: this.configService.get('SMTP_PASSWORD'),
				},
			});
		}
	}
}
