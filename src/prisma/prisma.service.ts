import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      log: ['warn', 'error'],
    });
  }

  /** métodos chamado pelo nest depois que o módulo que usa esse client for instanciado */
  onModuleInit() {
    return this.$connect();
  }

  /** métodos chamado pelo nest depois que o módulo que usa esse client for destruído */
  onModuleDestroy() {
    this.$disconnect();
  }
}
