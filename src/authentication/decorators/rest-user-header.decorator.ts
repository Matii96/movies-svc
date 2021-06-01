import { ApiHeader } from '@nestjs/swagger';

export const RestUserHeader = () =>
  ApiHeader({
    name: 'Authorization',
    description: 'Bearer <token>',
    required: true,
  });
