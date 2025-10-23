import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "src/users/users.service";
import { LoginInfoDto } from "./dto/auth.dto";

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
}
