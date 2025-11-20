import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({
      data: createUserDto,
    });
  }

  async findAll() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return users;
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        orders: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);

    // Si se está actualizando la contraseña, hashearla
    if (updateUserDto.password) {
      const bcrypt = require('bcrypt');
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async updateProfile(id: number, updateUserDto: UpdateUserDto) {
    // Los usuarios normales no pueden cambiar su rol o email
    const { role, email, ...safeUpdates } = updateUserDto;

    // Si se está actualizando la contraseña, hashearla
    if (safeUpdates.password) {
      const bcrypt = require('bcrypt');
      safeUpdates.password = await bcrypt.hash(safeUpdates.password, 10);
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: safeUpdates,
    });

    // Excluir password del resultado
    const { password: _, ...result } = user;
    return result;
  }

  async remove(id: number) {
    const user = await this.findOne(id);

    return this.prisma.user.delete({
      where: { id },
    });
  }
}

