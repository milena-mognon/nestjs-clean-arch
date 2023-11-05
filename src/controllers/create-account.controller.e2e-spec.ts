import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '@/app.module';
import { PrismaService } from '@/prisma/prisma.service';

describe('Create account (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);

    await app.init();
  });

  test('[POST] /accounts', async () => {
    const response = await request(app.getHttpServer()).post('/accounts').send({
      name: 'Jane Joe',
      email: 'jane.doe@mail.com',
      password: '123456',
    });

    expect(response.statusCode).toBe(201);

    const user = await prisma.user.findUnique({
      where: {
        email: 'jane.doe@mail.com',
      },
    });

    expect(user).toBeTruthy();
  });
});
