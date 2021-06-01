import { Injectable, HttpService, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/sequelize';
import { IRequestJwtData } from 'src/authentication/interfaces/request-jwt-data.interface';
import { DatabaseService } from 'src/database/database.service';
import { MovieInput } from './dto/movie.input';
import { MovieOutput } from './dto/movie.output';
import { Movie } from './entities/movie.entity';
import { IOmbdData } from './interfaces/omdb-data.interface';
import { IOmbdError } from './interfaces/omdb-error.interface';

@Injectable()
export class MoviesService {
  constructor(
    private readonly config: ConfigService,
    private readonly httpService: HttpService,
    @InjectModel(Movie) private readonly movieModel: typeof Movie,
    private readonly databaseService: DatabaseService,
  ) {}

  /**
   *
   * @param {Movie} movie
   * @returns {MovieOutput}
   */
  mapMovie({ title, released, genre, director, createdAt }: Movie): MovieOutput {
    return { title, released, genre, director, createdAt };
  }

  /**
   *
   * @param {number} userId
   * @param {MovieInput} data
   * @returns {Promise<MovieOutput>}
   */
  async create(user: IRequestJwtData, input: MovieInput) {
    const { data } = await this.httpService
      .get<IOmbdData | IOmbdError>(this.config.get<string>('OMDBAPI_URL'), {
        params: {
          apikey: this.config.get<string>('OMDBAPI_KEY'),
          t: input.title,
        },
      })
      .toPromise();
    if (data.Response === 'False') {
      throw new BadRequestException(data.Error);
    }

    return this.movieModel
      .create({
        title: data.Title,
        released: data.Released,
        genre: data.Genre,
        director: data.Director,
        userId: user.userId,
      })
      .then(this.mapMovie)
      .catch((err) => this.databaseService.handleDatabaseError(err));
  }

  /**
   *
   * @param {number} userId
   * @returns {Promise<MovieOutput[]>}
   */
  async list(userId: number) {
    return this.movieModel.findAll({ where: { userId } }).then((movies) => movies.map(this.mapMovie));
  }
}
