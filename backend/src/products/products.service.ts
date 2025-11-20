import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) { }

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
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
    page?: number;
    limit?: number;
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

    if (filters?.minPrice !== undefined || filters?.maxPrice !== undefined) {
      where.price = {};
      if (filters.minPrice !== undefined) where.price.gte = filters.minPrice;
      if (filters.maxPrice !== undefined) where.price.lte = filters.maxPrice;
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

    // Sorting
    let orderBy: any = { createdAt: 'desc' };
    if (filters?.sort) {
      switch (filters.sort) {
        case 'price-asc':
          orderBy = { price: 'asc' };
          break;
        case 'price-desc':
          orderBy = { price: 'desc' };
          break;
        case 'newest':
          orderBy = { createdAt: 'desc' };
          break;
        case 'rating':
          orderBy = { rating: 'desc' };
          break;
      }
    }

    // Pagination
    const page = filters?.page || 1;
    const limit = filters?.limit || 100;
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: {
          category: true,
          brand: true,
        },
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data: products,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
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

