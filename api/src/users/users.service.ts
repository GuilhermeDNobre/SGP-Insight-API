import { Injectable, NotFoundException } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user-dto";
import { UpdateUserDto } from "./dto/update-user-dto";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async findAllActive() {
    const users = await this.prisma.user.findMany({
      where: { deleted: false },
      select: {
        id: true,
        email: true,
        firstName: true,
        role: true,
      },
    });

    return users;
  }


  async validateUserExistence(email: string, password: string) {
    const user = await this.findByEmail(email);
    if (!user) return null;

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) return null;
    const { password: _, ...result } = user;
    return result;
  }

  async createUser({email, password, firstName}: CreateUserDto){
    const user = await this.findByEmail(email);
    if (user) return null;

    const hashedPassword = await bcrypt.hash(password, 10);
    return await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName
      }
    })
  }

  async updateUser(id: string, dto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user || user.deleted) {
      throw new NotFoundException('Usuário não encontrado ou excluído');
    }

    const data: any = {};

    if (dto.firstName) data.firstName = dto.firstName;
    if (dto.email) data.email = dto.email;
    if (dto.password) data.password = await bcrypt.hash(dto.password, 10);

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data,
    });

    const { password, ...result } = updatedUser;
    return result;
  }

  async softDeleteUser(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const deletedUser = await this.prisma.user.update({
      where: { id },
      data: { deleted: true },
    });

    const { password, ...result } = deletedUser;
    return result;
  }
}
