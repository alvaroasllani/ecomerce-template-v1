import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Excluir password del resultado
    const { password: _, ...result } = user;
    return result;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    // Verificar si el email ya existe
    const existingUser = await this.usersService.findByEmail(registerDto.email);

    if (existingUser) {
      throw new UnauthorizedException('El email ya está registrado');
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Crear el usuario
    const user = await this.usersService.create({
      ...registerDto,
      password: hashedPassword,
    });

    // Generar token
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    };
  }

  async getProfile(userId: number) {
    const user = await this.usersService.findOne(userId);

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const { password: _, ...result } = user;
    return result;
  }

  async changePassword(userId: number, changePasswordDto: ChangePasswordDto) {
    const user = await this.usersService.findOne(userId);

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    // Verificar contraseña actual
    const isPasswordValid = await bcrypt.compare(
      changePasswordDto.currentPassword,
      user.password
    );

    if (!isPasswordValid) {
      throw new BadRequestException('La contraseña actual es incorrecta');
    }

    // Hash de la nueva contraseña
    const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);

    // Actualizar contraseña
    await this.usersService.update(userId, {
      password: hashedPassword,
    });

    return { message: 'Contraseña actualizada exitosamente' };
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      // Por seguridad, no indicamos si el email existe o no
      return { message: 'Si el correo existe, recibirás un enlace para restablecer tu contraseña' };
    }

    // Generar token único
    const crypto = require('crypto');
    const token = crypto.randomBytes(32).toString('hex');

    // Expiración en 1 hora
    const expires = new Date();
    expires.setHours(expires.getHours() + 1);

    await this.usersService.updatePasswordResetToken(user.id, token, expires);

    // Simular envío de correo
    const resetLink = `http://localhost:3000/reset-password?token=${token}`;
    console.log('--------------------------------------------------');
    console.log('🔑 LINK DE RECUPERACIÓN DE CONTRASEÑA:');
    console.log(resetLink);
    console.log('--------------------------------------------------');

    return { message: 'Si el correo existe, recibirás un enlace para restablecer tu contraseña' };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.usersService.findByResetToken(token);

    if (!user) {
      throw new BadRequestException('Token inválido o expirado');
    }

    // Hash de la nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar contraseña y limpiar token
    await this.usersService.update(user.id, {
      password: hashedPassword,
    });

    await this.usersService.updatePasswordResetToken(user.id, null, null);

    return { message: 'Contraseña restablecida exitosamente' };
  }
}

