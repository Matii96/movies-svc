import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, HttpService } from '@nestjs/common';
import * as request from 'supertest';
import { AxiosResponse } from 'axios';
import { of } from 'rxjs';
import { AppModule } from 'src/app.module';
import { LoginMockUser } from 'test/helpers';
import { movieInputMock, movieOutputMock, omdbDataMock } from 'src/movies/movies.fixtures';
import { MovieOutput } from './dto/movie.output';

const validateOutput = (output: MovieOutput) => {
  const { id, createdAt, ...data } = output;
  const expected = movieOutputMock();

  expect(id).toBeDefined();
  expect(createdAt).toBeDefined();
  expect(data).toEqual({
    title: expected.title,
    released: expected.released.toISOString(),
    genre: expected.genre,
    director: expected.director,
  });
};

describe('Movies (e2e)', () => {
  let app: INestApplication;
  let jwtBasic: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(async () =>
              of(<AxiosResponse>{
                data: omdbDataMock(),
                status: 200,
                statusText: 'OK',
                headers: {},
                config: {},
              }),
            ),
          },
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    jwtBasic = await LoginMockUser(app, 'basic');

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('create', () => {
    it('should fail - no token', () => {
      return request(app.getHttpServer()).post('/movies').send(movieInputMock()).expect(401);
    });

    describe('should fail - invalid data', () => {
      it('no title', () => {
        return request(app.getHttpServer()).post('/movies').set('authorization', jwtBasic).send({}).expect(400);
      });

      it('invalid title', () => {
        return request(app.getHttpServer())
          .post('/movies')
          .set('authorization', jwtBasic)
          .send({ title: 111 })
          .expect(400);
      });
    });

    it('should pass', () => {
      return request(app.getHttpServer())
        .post('/movies')
        .set('authorization', jwtBasic)
        .send(movieInputMock())
        .expect(201)
        .expect((res) => validateOutput(res.body));
    });

    it('should fail - title is unique', () => {
      return request(app.getHttpServer())
        .post('/movies')
        .set('authorization', jwtBasic)
        .send(movieInputMock())
        .expect(400);
    });
  });

  describe('list', () => {
    it('should fail - no token', () => {
      return request(app.getHttpServer()).get('/movies').send(movieInputMock()).expect(401);
    });

    it('should pass', () => {
      return request(app.getHttpServer())
        .get('/movies')
        .set('authorization', jwtBasic)
        .expect(200)
        .expect((res) => validateOutput(res.body[0]));
    });
  });
});
