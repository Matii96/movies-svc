import { IRequestJwtData } from './interfaces/request-jwt-data.interface';

export const jwtUserMock = (): IRequestJwtData => ({
  userId: 123,
  name: 'Basic Thomas',
  role: 'basic',
  iat: 1606221838,
  exp: 1606223638,
  iss: 'https://www.netguru.com/',
  sub: '123',
});
