import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Health (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/health (GET)', () => {
    const httpServer = app.getHttpServer() as Parameters<typeof request>[0];

    return request(httpServer)
      .get('/health')
      .expect(200)
      .expect((response: request.Response) => {
        const body = response.body as {
          status: string;
          timestamp: string;
        };

        expect(body.status).toBe('ok');
        expect(typeof body.timestamp).toBe('string');
      });
  });
});
