import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user-dto";

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
}
