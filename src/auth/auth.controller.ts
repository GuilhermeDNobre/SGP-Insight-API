import { AuthService } from "./auth.service";
import { Body, Controller, HttpException, Post } from "@nestjs/common";
import { LoginInfoDto } from "./dto/auth.dto";

@Controller("auth")
export class AuthController {
  constructor(private AuthService: AuthService) {}
  @Post("login")
  async login(@Body() authPayload: LoginInfoDto) {
    const user = await this.AuthService.validateUser(authPayload);
    if (!user)
      throw new HttpException("There was a problem with the login", 401);
    return user;
  }
}
