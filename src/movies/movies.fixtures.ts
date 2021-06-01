import { jwtUserMock } from 'src/authentication/authentication.fixtures';
import { MovieInput } from './dto/movie.input';
import { MovieOutput } from './dto/movie.output';
import { Movie } from './entities/movie.entity';

export const movieInputMock = (): MovieInput => ({ title: 'Star wars' });

export const movieOutputMock = (): MovieOutput => ({
  title: 'Star wars',
  released: new Date('25 May 1977'),
  genre: 'Action, Adventure, Fantasy, Sci-Fi',
  director: 'George Lucas',
  createdAt: new Date('10 June 2000'),
});

export const movieEntityMock = () =>
  <Movie>{
    id: 'd160fee1-3255-413c-b4de-acd3892c5533',
    ...movieOutputMock(),
    userId: jwtUserMock().userId,
    createdAt: new Date('10 June 2000'),
  };
