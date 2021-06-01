import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { DatabaseService } from 'src/database/database.service';
import { jwtUserMock } from 'src/authentication/authentication.fixtures';
import { MoviesService } from './movies.service';
import { Movie } from './entities/movie.entity';
import { movieInputMock, movieOutputMock, movieEntityMock } from './movies.fixtures';
import { MovieOutput } from './dto/movie.output';

const mapMovieMock = (service: MoviesService) =>
  jest.spyOn(service, 'mapMovie').mockImplementationOnce(
    ({ title, released, genre, director, createdAt }: Movie): MovieOutput => ({
      title,
      released,
      genre,
      director,
      createdAt,
    }),
  );

describe('MoviesService', () => {
  let service: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
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

    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should map movie', async () => {
    expect(service.mapMovie(movieEntityMock())).toEqual(movieOutputMock());
  });

  it('should create movie', async () => {
    // mapMovieMock(service);
    expect(await service.create(jwtUserMock(), movieInputMock())).toEqual(movieOutputMock());
  });

  it('should get list movies', async () => {
    // mapMovieMock(service);

    console.log(await service.list(jwtUserMock().userId), movieOutputMock());

    expect(await service.list(jwtUserMock().userId)).toEqual([movieOutputMock()]);
  });
});
