import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsInt,
  IsBoolean,
  IsOptional,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsString()
  @IsOptional()
  image?: string;

  @IsString()
  @IsOptional()
  bgColor?: string;

  @IsBoolean()
  @IsOptional()
  featured?: boolean;

  @IsBoolean()
  @IsOptional()
  inStock?: boolean;

  @IsNumber()
  @IsOptional()
  @Min(0)
  rating?: number;

  @IsInt()
  @IsOptional()
  @Min(0)
  reviews?: number;

  @IsInt()
  @IsNotEmpty()
  categoryId: number;

  @IsInt()
  @IsNotEmpty()
  brandId: number;
}

