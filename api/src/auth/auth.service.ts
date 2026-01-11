/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "src/users/users.service";
import { LoginInfoDto } from "./dto/login-dto";
import { CreateUserDto } from "src/users/dto/create-user-dto";
import { EmailService } from "src/email/email.service";
import { PrismaService } from "src/prisma/prisma.service";
import bcrypt from "node_modules/bcryptjs";

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private emailService: EmailService,
    private prisma: PrismaService
  ) {}
  
  async validateUser({ email, password }: LoginInfoDto) {
    const user = await this.usersService.validateUserExistence(email, password);
      if (!user || user.disabled || user.deleted) return null;
        const payload = {
        userId: user.id,
        email: user.email,
        role: user.role,
      };
    return this.jwtService.sign(payload);
  }

  async registerUser({ email, password, firstName }: CreateUserDto) {
    const user = await this.usersService.createUser({ email, password, firstName });
    if (!user) return null;
    return this.jwtService.sign(user);
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new NotFoundException('Email não encontrado');
    }
    
    const newPassword = generateDistinctPassword(8);

    const hashed = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { password: hashed },
    });

    await this.emailService.sendNewPasswordEmail(user.email, newPassword);

    return { message: 'Nova senha gerada e enviada por email' };
  }

  async resetPassword(token: string, newPassword: string, confirmPassword: string) {
    if (newPassword !== confirmPassword) {
      throw new BadRequestException('Senhas não conferem');
    }

    const payload = this.jwtService.verify(token);

    const hashed = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { id: payload.sub },
      data: { password: hashed },
    });

    return { message: 'Senha alterada com sucesso' };
  }

} 

function generateDistinctPassword(length: number): string {
  const pool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  if (length > pool.length) {
    throw new Error('Requested password length exceeds unique character pool size');
  }

  const chars = pool.split('');
  let password = '';
  for (let i = 0; i < length; i++) {
    const idx = Math.floor(Math.random() * chars.length);
    password += chars.splice(idx, 1)[0];
  }

  return password;
}
