import { Injectable, HttpService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/sequelize';
import { IRequestJwtData } from 'src/authentication/interfaces/request-jwt-data.interface';
import { DatabaseService } from 'src/database/database.service';
import { MovieInput } from './dto/movie.input';
import { MovieOutput } from './dto/movie.output';
import { Movie } from './entities/movie.entity';

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
  async create(user: IRequestJwtData, data: MovieInput) {
    const omdbData = await this.httpService
      .get('http://www.omdbapi.com', {
        params: {
          apikey: this.config.get<string>('MOVIES_BASIC_LIMIT'),
          t: data.title,
        },
      })
      .toPromise();

    console.log(omdbData);

    return this.movieModel
      .create({ userId: user.userId, ...data })
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
