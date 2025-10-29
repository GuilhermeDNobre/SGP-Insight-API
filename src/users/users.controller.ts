import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user-dto';
import { ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { UserDto } from './dto/user-dto';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @ApiOperation({summary: 'Used by an ADMIN to list all available users'})
    @ApiBody({'type': UserDto})
    @ApiResponse({ status: 200, description: 'Lista de usuários' })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    @Roles('ADMIN') // apenas ADMIN pode listar usuários
    @Get()
    async listUsers() {
        return this.usersService.findAllActive();
    }

    @ApiOperation({summary: 'Used by an ADMIN to update an user'})
    @ApiBody({'type': UpdateUserDto})
    @ApiResponse({ status: 200, description: 'Usuário atualizado com sucesso' })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    @Roles('ADMIN')
    @Patch(':id')
    async updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto) {
        return this.usersService.updateUser(id, dto);
    }

    @ApiOperation({summary: 'Used by an user to update itself'})
    @ApiBody({'type': UpdateUserDto})
    @ApiResponse({ status: 200, description: 'Usuário atualizado com sucesso' })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    @Roles('ADMIN', 'MANAGER')
    @Patch()
    async updateSelf(@Req() req, @Body() dto: UpdateUserDto) {
        return this.usersService.updateUser(req.user.userId, dto);
    }

    @ApiOperation({summary: 'Used by an ADMIN to soft delete an user'})
    @ApiResponse({ status: 200, description: 'Usuário atualizado com sucesso' })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    @Roles('ADMIN')
    @Delete(':id')
    async deleteUser(@Param('id') id: string) {
        return this.usersService.softDeleteUser(id);
    }

    
}
