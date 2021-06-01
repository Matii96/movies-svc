import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './jwt-auth.guard';
import { jwtUserMock } from '../authentication.fixtures';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'secret',
          verifyOptions: {
            clockTimestamp: 1, // Hack making each expiring jwt to be valid
          },
        }),
      ],
      providers: [JwtAuthGuard],
    }).compile();

    guard = module.get(JwtAuthGuard);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should allow access', () => {
    jest.spyOn(guard, 'validateToken').mockImplementationOnce((authorization: string) => jwtUserMock());
    const context = <ExecutionContext>{
      switchToHttp: () => ({ getRequest: () => ({ headers: { authorization: 'test' } }) }),
    };
    expect(guard.canActivate(context)).toBe(true);
  });

  it('should get user from token', () => {
    const token =
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyMywibmFtZSI6IkJhc2ljIFRob21hcyIsInJvbGUiOiJiYXNpYyIsImlhdCI6MTYyMjUzNzE1NiwiZXhwIjoxNjIyNTM4OTU2LCJpc3MiOiJodHRwczovL3d3dy5uZXRndXJ1LmNvbS8iLCJzdWIiOiIxMjMifQ.Sjrc75yqtR7HntHim4ibNmcA00KCNOX_FrrXGV-WDN0';
    const { userId, name, role } = guard.validateToken(token);

    expect(userId).toBe(123);
    expect(name).toBe('Basic Thomas');
    expect(role).toBe('basic');
  });

  it('should throw UnauthorizedException', () => {
    const invalidToken = 'Bearer invalid-token';
    expect(() => guard.validateToken(invalidToken)).toThrowError(UnauthorizedException);
  });
});
