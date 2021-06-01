import { ApiProperty } from '@nestjs/swagger';

export class MovieOutput {
  @ApiProperty()
  id: string;

  @ApiProperty({ example: 'Star wars' })
  title: string;

  @ApiProperty()
  released: Date;

  @ApiProperty()
  genre: string;

  @ApiProperty()
  director: string;

  @ApiProperty()
  createdAt: Date;
}
