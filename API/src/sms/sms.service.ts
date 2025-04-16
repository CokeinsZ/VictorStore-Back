import { Injectable } from '@nestjs/common';
import { Twilio } from "twilio";

@Injectable()
export class SmsService {
    private accountSid: string;
    private authToken: string;
    private client: Twilio;

    constructor() {
        this.accountSid = process.env.TWILIO_ACCOUNT_SID || '';

        this.authToken = process.env.TWILIO_AUTH_TOKEN || '';

        if (!this.accountSid || !this.authToken) {
            throw new Error("Twilio credentials are not set in environment variables");
        }

        this.client = new Twilio(this.accountSid, this.authToken);
    }

    // Method to send SMS
    async sendSms(userNumber: string, name: string, code: string): Promise<string> {
        try {
            const message = await this.client.messages.create({
                body: this.getVerificationSMSBody(name, code),
                from: process.env.TWILIO_PHONE_NUMBER,
                to: userNumber,
            });
            return message.sid;
        } catch (error) {
            throw new Error(`Failed to send SMS: ${error.message}`);
        }
    }

    private getVerificationSMSBody(name: string, code: string): string {
        return `
        Hola ${name}, tu código de verificación es: ${code}. 
        Por favor, no compartas este código con nadie. 
        Si no solicitaste esto, ignora este mensaje.
        `;
    }

}

