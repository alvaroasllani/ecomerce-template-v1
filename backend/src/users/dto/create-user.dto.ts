import { IsEmail, IsNotEmpty, IsString, MinLength, IsEnum, IsOptional, Matches } from 'class-validator';
import { Role } from '@prisma/client';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;

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

