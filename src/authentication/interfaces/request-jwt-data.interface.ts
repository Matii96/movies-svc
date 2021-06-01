import { RequestJwtRole } from './request-jwt-type';

export interface IRequestJwtData {
  userId: number;
  name: string;
  role: RequestJwtRole;
  iat: number;
  exp: number;
  iss: string;
  sub: string;
}
