import {
  IsString,
  IsNumber,
  IsInt,
  IsBoolean,
  IsOptional,
  Min,
} from 'class-validator';

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

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
  @IsOptional()
  categoryId?: number;

  @IsInt()
  @IsOptional()
  brandId?: number;
}

