import { AuthService } from "./auth.service";
import { Body, Controller, Get, HttpCode, HttpException, Post, Req, UseGuards } from "@nestjs/common";
import { LoginInfoDto } from "./dto/auth.dto";
import type { Request } from "express";
import { LocalGuard } from "./guards/local.guard";
import { JwtAuthGuard } from "./guards/jwt.guard";
import { RegisterDto } from "./dto/register.dto";
import { RolesGuard } from "./guards/roles.guard";
import { Role } from "@prisma/client";
import { Roles } from "./decorator/roles.decorator";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse } from "@nestjs/swagger";


@Controller("auth")
export class AuthController {
  constructor(private AuthService: AuthService) {}

  @ApiOperation({summary: 'Used to login an user'})
  @ApiBody({type: LoginInfoDto})
  @ApiResponse({ status: 200, description: 'Login bem-sucedido' })
  @ApiResponse({ status: 400, description: 'Credenciais inválidas' })
  @Post("login")
  @UseGuards(LocalGuard)
  @HttpCode(200)
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
