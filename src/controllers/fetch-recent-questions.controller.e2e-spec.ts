import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '@/app.module';
import { PrismaService } from '@/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

describe('Fetch recent questions (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test('[GET] /questions', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'Jane Doe',
        email: 'jane.doe@mail.com',
        password: '123456',
      },
    });

    await prisma.question.createMany({
      data: [
        {
          title: 'question 1',
          slug: 'question-1',
          content: 'question content 1',
          authorId: user.id,
        },
        {
          title: 'question 2',
          slug: 'question-2',
          content: 'question content 2',
          authorId: user.id,
        },
      ],
    });

    const accessToken = jwt.sign({
      sub: user.id,
    });

    const response = await request(app.getHttpServer())
      .get('/questions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(200);

    expect(response.body).toEqual({
      questions: expect.arrayContaining([
        expect.objectContaining({ title: 'question 1' }),
        expect.objectContaining({ title: 'question 2' }),
      ]),
    });
  });
});
