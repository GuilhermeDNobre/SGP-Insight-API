import { AuthService } from "./auth.service";
import { Body, Controller, Get, HttpException, Post, Req, UseGuards } from "@nestjs/common";
import { LoginInfoDto } from "./dto/auth.dto";
import type { Request } from "express";
import { LocalGuard } from "./guards/local.guard";
import { JwtAuthGuard } from "./guards/jwt.guard";

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
}
