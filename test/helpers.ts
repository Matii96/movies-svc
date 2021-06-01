import { HttpService, INestApplication } from '@nestjs/common';
import { RequestJwtRole } from 'src/authentication/interfaces/request-jwt-type';

/**
 *
 * @param {INestApplication} app
 * @param {RequestJwtRole} role
 * @returns {Promise<string>}
 */
export async function LoginMockUser(app: INestApplication, role: RequestJwtRole) {
  let loginData: { username: string; password: string };
  switch (role) {
    case 'premium':
      loginData = { username: 'premium-jim', password: 'GBLtTyq3E_UNjFnpo9m6' };
      break;
    case 'basic':
      loginData = { username: 'basic-thomas', password: 'sR-_pcoow-27-6PAwCD8' };
      break;
  }

  const httpService = app.get(HttpService);
  const { data } = await httpService.post('http://auth-svc:3000/auth', loginData).toPromise();

  return 'Bearer ' + data.token;
}
