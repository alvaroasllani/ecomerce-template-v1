import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    return this.prisma.product.create({
      data: createProductDto,
      include: {
        category: true,
        brand: true,
      },
    });
  }

  async findAll(filters?: {
    categoryId?: number;
    brandId?: number;
    featured?: boolean;
    inStock?: boolean;
    search?: string;
  }) {
    const where: any = {};

    if (filters?.categoryId) {
      where.categoryId = filters.categoryId;
    }

    if (filters?.brandId) {
      where.brandId = filters.brandId;
    }

    if (filters?.featured !== undefined) {
      where.featured = filters.featured;
    }

    if (filters?.inStock !== undefined) {
      where.inStock = filters.inStock;
    }

    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.product.findMany({
      where,
      include: {
        category: true,
        brand: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        brand: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    return product;
  }

  async findFeatured() {
    return this.prisma.product.findMany({
      where: { featured: true },
      include: {
        category: true,
        brand: true,
      },
    });
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    await this.findOne(id);

    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
      include: {
        category: true,
        brand: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.product.delete({
      where: { id },
    });
  }

  async updateStock(id: number, inStock: boolean) {
    return this.prisma.product.update({
      where: { id },
      data: { inStock },
    });
  }
}

