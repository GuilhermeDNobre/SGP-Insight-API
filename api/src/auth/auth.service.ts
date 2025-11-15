/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "src/users/users.service";
import { LoginInfoDto } from "./dto/login-dto";
import { CreateUserDto } from "src/users/dto/create-user-dto";

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
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
} 
