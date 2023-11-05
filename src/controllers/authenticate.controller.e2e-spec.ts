import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '@/app.module';
import { PrismaService } from '@/prisma/prisma.service';
import { hash } from 'bcryptjs';

describe('Authenticate (E2E)', () => {
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

  test('[POST] /sessions', async () => {
    await prisma.user.create({
      data: {
        name: 'Jane Doe',
        email: 'jane.doe@mail.com',
        password: await hash('123456', 10),
      },
    });

    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: 'jane.doe@mail.com',
      password: '123456',
    });

    expect(response.statusCode).toBe(201);

    expect(response.body).toEqual({
      access_token: expect.any(String),
    });
  });
});
