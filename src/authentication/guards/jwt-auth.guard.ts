import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IRequestJwtData } from '../interfaces/request-jwt-data.interface';
import { IRequestJwt } from '../interfaces/request-jwt.interface';

@Injectable()
export class JwtAuthGuard {
  constructor(private readonly jwtService: JwtService) {}

  /**
   *
   * @param {ExecutionContext} context
   * @returns {boolean}
   */
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<IRequestJwt>();
    req.user = this.validateToken(req.headers.authorization);
    return true;
  }

  /**
   *
   * @param {string} bearerToken Example: Bearer jwt
   * @returns {IRequestJwtData}
   */
  validateToken(bearerToken: string): IRequestJwtData {
    if (!bearerToken) {
      throw new UnauthorizedException();
    }

    const segments = bearerToken.split(' ');
    if (segments[0] !== 'Bearer') {
      throw new UnauthorizedException();
    }

    try {
      return this.jwtService.verify<IRequestJwtData>(segments[1]);
    } catch (err) {
      throw new UnauthorizedException();
    }
  }
}
