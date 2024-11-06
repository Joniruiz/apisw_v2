import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CrearPeliculaDto {
  @ApiProperty({
    example: 'A New Hope',
    description: 'Título de la película',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    example: 4,
    description: 'Número de episodio',
  })
  @IsNotEmpty()
  @IsNumber()
  episode_id: number;

  @ApiProperty({
    example: 'It is a period of civil war...',
    description: 'Texto de apertura de la película',
  })
  @IsNotEmpty()
  @IsString()
  opening_crawl: string;

  @ApiProperty({
    example: 'George Lucas',
    description: 'Director de la película',
  })
  @IsNotEmpty()
  @IsString()
  director: string;

  @ApiProperty({
    example: 'Gary Kurtz',
    description: 'Productor de la película',
  })
  @IsNotEmpty()
  @IsString()
  producer: string;

  @ApiProperty({
    example: '1977-05-25',
    description: 'Fecha de estreno',
  })
  @IsNotEmpty()
  @IsString()
  release_date: string;
}
