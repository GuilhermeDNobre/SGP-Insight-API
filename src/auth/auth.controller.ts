import { AuthService } from "./auth.service";
import { Body, Controller, Get, HttpCode, HttpException, Post, Req, UseGuards } from "@nestjs/common";
import { LoginInfoDto } from "./dto/auth.dto";
import type { Request } from "express";
import { LocalGuard } from "./guards/local.guard";
import { JwtAuthGuard } from "./guards/jwt.guard";
import { RolesGuard } from "./guards/roles.guard";
import { Role } from "@prisma/client";
import { Roles } from "./decorator/roles.decorator";
import { CreateUserDto } from "src/users/dto/create-user-dto";
import { ApiBody, ApiOperation, ApiResponse } from "@nestjs/swagger";

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
  login(@Req() req: Request) { 
    return req.user
  }

  @ApiOperation({summary: 'Used to get user status'})
  @ApiResponse({ status: 200, description: 'Usuário encontrado' })
  @ApiResponse({ status: 401, description: 'Usuário não autorizado' })
  @Get("status")
  @UseGuards(JwtAuthGuard)
  status(@Req() req: Request) {
    return req.user;
  }

  @ApiOperation({summary: 'Used by an ADMIN to register an user'})
  @ApiBody({type: CreateUserDto})
  @ApiResponse({ status: 201, description: 'Usuário registrado com sucesso' })
  @ApiResponse({ status: 400, description: 'Requisição inválida' })
  @ApiResponse({ status: 401, description: 'Usuário não autorizado' })
  @Post("register")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async register(@Body() body: CreateUserDto) {
    const user = await this.AuthService.registerUser(body);
    if(!user) throw new HttpException('User already exists', 400);
    return user;
  }
}
