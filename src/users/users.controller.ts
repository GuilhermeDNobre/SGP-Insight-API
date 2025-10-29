import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user-dto';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Roles('ADMIN') // apenas ADMIN pode listar usuários
    @Get()
    async listUsers() {
        return this.usersService.findAllActive();
    }

    @Roles('ADMIN')
    @Patch(':id')
    async updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto) {
        return this.usersService.updateUser(id, dto);
    }

    @Roles('ADMIN')
    @Delete(':id')
    async deleteUser(@Param('id') id: string) {
        return this.usersService.softDeleteUser(id);
    }

    @Roles('ADMIN', 'MANAGER')
    @Patch()
    async updateSelf(@Req() req, @Body() dto: UpdateUserDto) {
        return this.usersService.updateUser(req.user.userId, dto);
    }
}
