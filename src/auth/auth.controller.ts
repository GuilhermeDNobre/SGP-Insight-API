import { AuthService } from "./auth.service";
import { Body, Controller, Get, HttpException, Post, Req, UseGuards } from "@nestjs/common";
import { LoginInfoDto } from "./dto/auth.dto";
import type { Request } from "express";
import { LocalGuard } from "./guards/local.guard";
import { JwtAuthGuard } from "./guards/jwt.guard";
import { RegisterDto } from "./dto/register.dto";
import { RolesGuard } from "./guards/roles.guard";
import { Role } from "@prisma/client";
import { Roles } from "./decorator/roles.decorator";

@Controller("auth")
export class AuthController {
  constructor(private AuthService: AuthService) {}

  @UseGuards(LocalGuard)
  @Post("login")
  login(@Req() req: Request) { 
    return req.user
  }

  @Get("status")
  @UseGuards(JwtAuthGuard)
  status(@Req() req: Request) {
    return req.user;
  }

  @Post("register")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async register(@Body() body: RegisterDto) {
    const user = await this.AuthService.registerUser(body);
    if(!user) throw new HttpException('User already exists', 400);
    return user;
  }
}
