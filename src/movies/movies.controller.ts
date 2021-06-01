import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { RestRequestUser } from 'src/authentication/decorators/rest-user.decorator';
import { IRequestJwtData } from 'src/authentication/interfaces/request-jwt-data.interface';
import { JwtAuthGuard } from 'src/authentication/guards/jwt-auth.guard';
import { MoviesLimitGuard } from './guards/movies-limit.guard';
import { MovieInput } from './dto/movie.input';
import { MovieOutput } from './dto/movie.output';
import { MoviesService } from './movies.service';

@ApiTags('Movies')
@UseGuards(JwtAuthGuard)
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  @UseGuards(MoviesLimitGuard)
  @ApiBody({ type: MovieInput })
  @ApiCreatedResponse({ type: MovieOutput })
  create(@RestRequestUser() user: IRequestJwtData, @Body() data: MovieInput) {
    return this.moviesService.create(user, data);
  }

  @Get()
  @ApiOkResponse({ type: [MovieOutput] })
  list(@RestRequestUser() user: IRequestJwtData) {
    return this.moviesService.list(user.userId);
  }
}
