import { jwtUserMock } from 'src/authentication/authentication.fixtures';
import { MovieInput } from './dto/movie.input';
import { MovieOutput } from './dto/movie.output';
import { Movie } from './entities/movie.entity';
import { IOmbdData } from './interfaces/omdb-data.interface';

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

export const omdbDataMock = (): IOmbdData => ({
  Title: 'Star Wars: Episode IV - A New Hope',
  Year: '1977',
  Rated: 'PG',
  Released: '25 May 1977',
  Runtime: '121 min',
  Genre: 'Action, Adventure, Fantasy, Sci-Fi',
  Director: 'George Lucas',
  Writer: 'George Lucas',
  Actors: 'Mark Hamill, Harrison Ford, Carrie Fisher, Peter Cushing',
  Plot: "Luke Skywalker joins forces with a Jedi Knight, a cocky pilot, a Wookiee and two droids to save the galaxy from the Empire's world-destroying battle station, while also attempting to rescue Princess Leia from the mysterious Darth Vader.",
  Language: 'English',
  Country: 'USA, UK',
  Awards: 'Won 6 Oscars. Another 58 wins & 29 nominations.',
  Poster:
    'https://m.media-amazon.com/images/M/MV5BNzVlY2MwMjktM2E4OS00Y2Y3LWE3ZjctYzhkZGM3YzA1ZWM2XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg',
  Ratings: [
    { Source: 'Internet Movie Database', Value: '8.6/10' },
    { Source: 'Rotten Tomatoes', Value: '92%' },
    { Source: 'Metacritic', Value: '90/100' },
  ],
  Metascore: '90',
  imdbRating: '8.6',
  imdbVotes: '1,250,277',
  imdbID: 'tt0076759',
  Type: 'movie',
  DVD: '10 Oct 2016',
  BoxOffice: '$460,998,507',
  Production: 'Lucasfilm Ltd.',
  Website: 'N/A',
  Response: 'True',
});
