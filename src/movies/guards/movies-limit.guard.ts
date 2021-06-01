import { BadRequestException, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { IRequestJwtData } from 'src/authentication/interfaces/request-jwt-data.interface';
import { IRequestJwt } from 'src/authentication/interfaces/request-jwt.interface';
import { Movie } from '../entities/movie.entity';

@Injectable()
export class MoviesLimitGuard {
  constructor(private readonly config: ConfigService, @InjectModel(Movie) private readonly movieModel: typeof Movie) {}

  /**
   *
   * @param {ExecutionContext} context
   * @returns {Promise<boolean>}
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<IRequestJwt>();
    await this.checkAccess(req.user);
    return true;
  }

  /**
   *
   * @param {IRequestJwtData} user
   */
  async checkAccess(user: IRequestJwtData) {
    if (user.role === 'premium') {
      return;
    }

    const date = new Date(),
      y = date.getFullYear(),
      m = date.getMonth();
    const moviesCount = await this.movieModel.count({
      where: {
        userId: user.userId,
        createdAt: {
          [Op.gte]: new Date(y, m, 1),
          [Op.lte]: new Date(y, m + 1, 1),
        },
      },
    });

    if (moviesCount >= this.config.get<number>('MOVIES_BASIC_LIMIT')) {
      throw new BadRequestException('movies-count-per-month-exceeded');
    }
  }
}
