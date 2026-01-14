import { Injectable, OnModuleInit } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

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

  async sendEmail(options: EmailOptions) {
    if (!this.transporter) {
      throw new Error('Transporter não inicializado.');
    }

    const mailOptions = {
      from: options.from || `"Suporte" <${process.env.EMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
    };

    return await this.transporter.sendMail(mailOptions);
  }

  async sendForgotPasswordEmail(to: string, resetLink: string) {
    const html = `
      <p>Para redefinir sua senha, clique no link abaixo:</p>
      <a href="${resetLink}">${resetLink}</a>
    `;
    return await this.sendEmail({ to, subject: 'Recuperação de senha', html });
  }

  async sendNewPasswordEmail(to: string, newPassword: string) {
    const html = `
      <p>Sua nova senha foi gerada com sucesso. Use-a para acessar sua conta e altere-a após o login.</p>
      <p><strong>Senha:</strong> ${newPassword}</p>
    `;
    return await this.sendEmail({ to, subject: 'Sua nova senha', html });
  }
}
