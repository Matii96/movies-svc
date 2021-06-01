import { Request } from 'express';
import { IRequestJwtData } from './request-jwt-data.interface';

export interface IRequestJwt extends Request {
  user: IRequestJwtData;
}
