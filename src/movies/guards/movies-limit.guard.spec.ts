import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { getModelToken } from '@nestjs/sequelize';
import { IRequestJwtData } from 'src/authentication/interfaces/request-jwt-data.interface';
import { jwtUserMock } from 'src/authentication/authentication.fixtures';
import { MoviesLimitGuard } from './movies-limit.guard';
import { Movie } from '../entities/movie.entity';

describe('MoviesLimitGuard', () => {
  let guard: MoviesLimitGuard;
  let movieModelMock: typeof Movie;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ load: [() => ({ MOVIES_BASIC_LIMIT: 5 })] })],
      providers: [
        MoviesLimitGuard,
        {
          provide: getModelToken(Movie),
          useValue: {
            count: jest.fn(async () => 10),
          },
        },
      ],
    }).compile();

    guard = module.get(MoviesLimitGuard);
    movieModelMock = module.get(getModelToken(Movie));
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should allow access', async () => {
    jest.spyOn(guard, 'checkAccess').mockImplementationOnce(async (user: IRequestJwtData) => undefined);
    const context = <ExecutionContext>{
      switchToHttp: () => ({ getRequest: () => ({ user: jwtUserMock() }) }),
    };
    expect(await guard.canActivate(context)).toBe(true);
  });

  describe('check access', () => {
    it('should allow premium user', async () => {
      const user = jwtUserMock();
      user.role = 'premium';
      expect(await guard.checkAccess(user)).toBeUndefined();
    });

    it('should allow basic user', async () => {
      jest.spyOn(movieModelMock, 'count').mockImplementationOnce(async () => 4);
      expect(await guard.checkAccess(jwtUserMock())).toBeUndefined();
    });

    it('should deny access to basic user', async () => {
      await expect(guard.checkAccess(jwtUserMock())).rejects.toThrowError(ForbiddenException);
    });
  });
});
