import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/sequelize';
import { IRequestJwtData } from 'src/authentication/interfaces/request-jwt-data.interface';
import { jwtUserMock } from 'src/authentication/authentication.fixtures';
import { MovieInput } from './dto/movie.input';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { movieInputMock, movieOutputMock } from './movies.fixtures';
import { Movie } from './entities/movie.entity';
import { ConfigModule } from '@nestjs/config';

describe('MoviesController', () => {
  let controller: MoviesController;
  let moviesServiceMock: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ load: [() => ({ MOVIES_BASIC_LIMIT: 5 })] })],
      controllers: [MoviesController],
      providers: [
        {
          provide: MoviesService,
          useValue: {
            create: jest.fn((user: IRequestJwtData, data: MovieInput) => movieOutputMock()),
            list: jest.fn((userId: number) => [movieOutputMock()]),
          },
        },
        {
          provide: JwtService,
          useValue: {
            verify: jest.fn((token: string) => jwtUserMock()),
          },
        },
        {
          provide: getModelToken(Movie),
          useValue: {
            count: jest.fn(async () => 5),
          },
        },
      ],
    }).compile();

    controller = module.get(MoviesController);
    moviesServiceMock = module.get(MoviesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create movie', async () => {
    expect(await controller.create(jwtUserMock(), movieInputMock())).toEqual(movieOutputMock());
    expect(moviesServiceMock.create).toHaveBeenCalledTimes(1);
  });

  it('should get list of movies', async () => {
    expect(await controller.list(jwtUserMock())).toEqual([movieOutputMock()]);
    expect(moviesServiceMock.list).toHaveBeenCalledTimes(1);
  });
});
