import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { getModelToken } from '@nestjs/sequelize';
import { AxiosResponse } from 'axios';
import { of } from 'rxjs';
import { DatabaseService } from 'src/database/database.service';
import { jwtUserMock } from 'src/authentication/authentication.fixtures';
import { MoviesService } from './movies.service';
import { Movie } from './entities/movie.entity';
import { movieInputMock, movieOutputMock, movieEntityMock, omdbDataMock } from './movies.fixtures';
import { MovieOutput } from './dto/movie.output';

const mapMovieMock = (service: MoviesService) =>
  jest.spyOn(service, 'mapMovie').mockImplementationOnce(
    ({ id, title, released, genre, director, createdAt }: Movie): MovieOutput => ({
      id,
      title,
      released,
      genre,
      director,
      createdAt,
    }),
  );

describe('MoviesService', () => {
  let service: MoviesService;
  let httpServiceMock: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ load: [() => ({})] })],
      providers: [
        MoviesService,
        {
          provide: HttpService,
          useValue: { get: jest.fn(async () => undefined) },
        },
        {
          provide: getModelToken(Movie),
          useValue: {
            findAll: jest.fn(async () => [movieEntityMock()]),
            create: jest.fn(async () => movieEntityMock()),
          },
        },
        {
          provide: DatabaseService,
          useValue: { handleDatabaseError: jest.fn(() => undefined) },
        },
      ],
    }).compile();

    service = module.get(MoviesService);
    httpServiceMock = module.get(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should map movie', async () => {
    expect(service.mapMovie(movieEntityMock())).toEqual(movieOutputMock());
  });

  it('should create movie', async () => {
    const result: AxiosResponse = {
      data: omdbDataMock(),
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    };
    jest.spyOn(httpServiceMock, 'get').mockImplementationOnce(() => of(result));

    mapMovieMock(service);
    expect(await service.create(jwtUserMock(), movieInputMock())).toEqual(movieOutputMock());
  });

  it('should get list movies', async () => {
    mapMovieMock(service);
    expect(await service.list(jwtUserMock().userId)).toEqual([movieOutputMock()]);
  });
});
