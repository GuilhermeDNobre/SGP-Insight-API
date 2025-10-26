import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./../auth.service";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: AuthService) {
    super({
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: false,
    });
  }

  validate(email: string, password: string){
    const user = this.authService.validateUser({email, password});
    if (!user) {
      throw new UnauthorizedException;
    }
    return user;
  }
}
