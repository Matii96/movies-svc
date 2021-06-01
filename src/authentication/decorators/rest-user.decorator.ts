import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IRequestJwt } from '../interfaces/request-jwt.interface';

export const RestRequestUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => (<IRequestJwt>ctx.switchToHttp().getRequest()).user,
);
