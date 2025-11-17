import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): object {
    return {
      message: 'Bienvenido a la API de E-commerce',
      version: '1.0.0',
      endpoints: {
        auth: '/api/auth',
        products: '/api/products',
        categories: '/api/categories',
        brands: '/api/brands',
        orders: '/api/orders',
        users: '/api/users',
      },
    };
  }
}

