import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import "dotenv/config";
import { UsersModule } from "src/users/users.module";
import { PassportModule } from "@nestjs/passport";
import { LocalStrategy } from "./strategies/local.strategy";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { EmailService } from "src/email/email.service";
import { IAuthMechanism } from "./interfaces/auth-mechanism.interface";
import { JwtAuthMechanism } from "./implementations/jwt-auth-mechanism";

@Module({
  imports: [
    PassportModule,
    UsersModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "1h" },
      global: true,
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    EmailService,
    LocalStrategy,
    JwtStrategy,
    {
      provide: IAuthMechanism,
      useClass: JwtAuthMechanism,
    },
  ],
})
export class AuthModule {}
