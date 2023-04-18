import { Injectable } from '@nestjs/common';
import { createTransport } from 'nodemailer';
import * as Mail from 'nodemailer/lib/mailer';

@Injectable()
export default class EmailService {
  private nodemailerTransport: Mail;

  constructor() {
    this.nodemailerTransport = createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  sendMail({ email, html }) {
    return this.nodemailerTransport.sendMail({
      from: 'Meals App',
      to: email,
      subject: 'Account activation',
      text: '',
      html,
    });
  }

  sendActivationLink(email: string, token: string) {
    const link = `${process.env.CLIENT_URL}/activation/${token}`;

    return this.sendMail({
      email,
      html: `
        Hi there,
        <br>
        <br>
        Thank you for signing up for Meals App. Click on the link below to verify your email:
        <br>
        <br>
        <a href="${link}">${link}</a>
      `,
    });
  }
}
