import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsArray,
  IsInt,
  IsNumber,
  IsOptional,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
  @IsInt()
  @IsNotEmpty()
  productId: number;

  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsString()
  @IsNotEmpty()
  shippingName: string;

  @IsEmail()
  @IsNotEmpty()
  shippingEmail: string;

  @IsString()
  @IsNotEmpty()
  shippingAddress: string;

  @IsString()
  @IsNotEmpty()
  shippingCity: string;

  @IsString()
  @IsNotEmpty()
  shippingZip: string;

  @IsString()
  @IsNotEmpty()
  shippingCountry: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  shipping?: number;
}

