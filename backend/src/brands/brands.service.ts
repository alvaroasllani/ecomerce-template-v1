import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Injectable()
export class BrandsService {
  constructor(private prisma: PrismaService) {}

  async create(createBrandDto: CreateBrandDto) {
    const existing = await this.prisma.brand.findUnique({
      where: { slug: createBrandDto.slug },
    });

    if (existing) {
      throw new ConflictException('Ya existe una marca con ese slug');
    }

    return this.prisma.brand.create({
      data: createBrandDto,
    });
  }

  async findAll() {
    return this.prisma.brand.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(id: number) {
    const brand = await this.prisma.brand.findUnique({
      where: { id },
      include: {
        products: {
          include: {
            category: true,
          },
        },
      },
    });

    if (!brand) {
      throw new NotFoundException(`Marca con ID ${id} no encontrada`);
    }

    return brand;
  }

  async findBySlug(slug: string) {
    const brand = await this.prisma.brand.findUnique({
      where: { slug },
      include: {
        products: {
          include: {
            category: true,
          },
        },
      },
    });

    if (!brand) {
      throw new NotFoundException(`Marca con slug ${slug} no encontrada`);
    }

    return brand;
  }

  async update(id: number, updateBrandDto: UpdateBrandDto) {
    await this.findOne(id);

    return this.prisma.brand.update({
      where: { id },
      data: updateBrandDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    // Verificar si tiene productos asociados
    const productsCount = await this.prisma.product.count({
      where: { brandId: id },
    });

    if (productsCount > 0) {
      throw new ConflictException(
        'No se puede eliminar una marca con productos asociados',
      );
    }

    return this.prisma.brand.delete({
      where: { id },
    });
  }
}

