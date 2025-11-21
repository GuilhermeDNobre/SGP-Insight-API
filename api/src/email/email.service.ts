import { Injectable, OnModuleInit } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService implements OnModuleInit {
  private transporter: nodemailer.Transporter;

  async onModuleInit() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    console.log('📧 Gmail Mailer iniciado');
  }

  async sendForgotPasswordEmail(to: string, resetLink: string) {
    if (!this.transporter) {
      throw new Error('❌ Transporter não inicializado.');
    }

    return await this.transporter.sendMail({
      from: `"Suporte" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Recuperação de senha',
      html: `
        <p>Para redefinir sua senha, clique no link abaixo:</p>
        <a href="${resetLink}">${resetLink}</a>
      `,
    });
  }
}
