import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, createOrderDto: CreateOrderDto) {
    // Generar número de orden único
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Calcular totales
    let subtotal = 0;
    const items = [];

    for (const item of createOrderDto.items) {
      const product = await this.prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        throw new BadRequestException(`Producto con ID ${item.productId} no encontrado`);
      }

      if (!product.inStock) {
        throw new BadRequestException(`Producto ${product.name} no disponible`);
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      items.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      });
    }

    const shipping = createOrderDto.shipping || 0;
    const total = subtotal + shipping;

    // Crear la orden con los items
    return this.prisma.order.create({
      data: {
        orderNumber,
        userId,
        shippingName: createOrderDto.shippingName,
        shippingEmail: createOrderDto.shippingEmail,
        shippingAddress: createOrderDto.shippingAddress,
        shippingCity: createOrderDto.shippingCity,
        shippingZip: createOrderDto.shippingZip,
        shippingCountry: createOrderDto.shippingCountry,
        subtotal,
        shipping,
        total,
        orderItems: {
          create: items,
        },
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
      },
    });
  }

  async findAll(filters?: { userId?: number; status?: OrderStatus }) {
    const where: any = {};

    if (filters?.userId) {
      where.userId = filters.userId;
    }

    if (filters?.status) {
      where.status = filters.status;
    }

    return this.prisma.order.findMany({
      where,
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: {
          include: {
            product: {
              include: {
                category: true,
                brand: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Orden con ID ${id} no encontrada`);
    }

    return order;
  }

  async findByOrderNumber(orderNumber: string) {
    const order = await this.prisma.order.findUnique({
      where: { orderNumber },
      include: {
        orderItems: {
          include: {
            product: {
              include: {
                category: true,
                brand: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Orden con número ${orderNumber} no encontrada`);
    }

    return order;
  }

  async findUserOrders(userId: number) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async updateStatus(id: number, updateOrderStatusDto: UpdateOrderStatusDto) {
    await this.findOne(id);

    return this.prisma.order.update({
      where: { id },
      data: {
        status: updateOrderStatusDto.status,
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.order.delete({
      where: { id },
    });
  }

  async getOrderStats() {
    const totalOrders = await this.prisma.order.count();
    const pendingOrders = await this.prisma.order.count({
      where: { status: OrderStatus.PENDING },
    });
    const processingOrders = await this.prisma.order.count({
      where: { status: OrderStatus.PROCESSING },
    });
    const shippedOrders = await this.prisma.order.count({
      where: { status: OrderStatus.SHIPPED },
    });
    const deliveredOrders = await this.prisma.order.count({
      where: { status: OrderStatus.DELIVERED },
    });

    const totalRevenue = await this.prisma.order.aggregate({
      _sum: {
        total: true,
      },
      where: {
        status: {
          in: [OrderStatus.PROCESSING, OrderStatus.SHIPPED, OrderStatus.DELIVERED],
        },
      },
    });

    return {
      totalOrders,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      totalRevenue: totalRevenue._sum.total || 0,
    };
  }
}

