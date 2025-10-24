/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "src/users/users.service";
import { LoginInfoDto } from "./dto/auth.dto";
import { RegisterDto } from "./dto/register.dto";

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}
  
  async validateUser({ email, password }: LoginInfoDto) {
    const user = await this.usersService.validateUserExistence(email, password);
    if (!user) return null;
    if (user.disabled) return null;
    if (user.deleted) return null;
    const { disabled, deleted, created_at, updated_at, ...result } = user;
    return this.jwtService.sign(result);
  }

  async registerUser({ email, password, firstName }: RegisterDto) {
    const user = await this.usersService.createUser({ email, password, firstName });
    if (!user) return null;
    return this.jwtService.sign(user);
  }
}
