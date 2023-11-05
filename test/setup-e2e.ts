import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'node:crypto';
import { execSync } from 'node:child_process';
import 'dotenv/config';

const prisma = new PrismaClient();

function generateUniqueDatabaseURL(schemaId: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL environment variable');
  }

  const url = new URL(process.env.DATABASE_URL);

  url.searchParams.set('schema', schemaId);

  return url.toString();
}

const schemaID = randomUUID();

// cria um banco de dados novo para todos os testes de um arquivo
beforeAll(async () => {
  const databaseURL = generateUniqueDatabaseURL(schemaID);

  process.env.DATABASE_URL = databaseURL;

  // executa um comando no terminal
  // deploy só roda as migrations no banco
  execSync('yarn prisma migrate deploy');
});

afterAll(async () => {
  await prisma.$executeRawUnsafe(
    `DROP SCHEMA IF EXISTS "${schemaID}" CASCADE;`,
  );
  await prisma.$disconnect();
});
