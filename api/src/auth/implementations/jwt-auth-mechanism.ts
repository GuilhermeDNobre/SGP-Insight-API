import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { IAuthMechanism } from '../interfaces/auth-mechanism.interface';

@Injectable()
export class JwtAuthMechanism implements IAuthMechanism {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.validateUserExistence(email, password);
    if (!user || user.disabled || user.deleted) return null;
    return user;
  }

  generateToken(payload: any): string {
    return this.jwtService.sign(payload);
  }

  verifyToken(token: string): any {
    return this.jwtService.verify(token);
  }
}