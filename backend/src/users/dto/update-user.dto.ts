import { IsEmail, IsString, MinLength, IsEnum, IsOptional, Matches } from 'class-validator';
import { Role } from '@prisma/client';

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  fullName?: string;

  @IsString()
  @Matches(/^[67][0-9]{7}$/, {
    message: 'El número de celular debe tener 8 dígitos y comenzar con 6 o 7'
  })
  @IsOptional()
  phoneNumber?: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}

