import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class MovieInput {
  @ApiProperty({ example: 'Star wars' })
  @IsString()
  @IsNotEmpty()
  title: string;
}
