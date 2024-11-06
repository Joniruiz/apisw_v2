import { IsString, IsNumber, IsOptional } from 'class-validator';

export class ActualizarPeliculaDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsNumber()
  episode_id?: number;

  @IsOptional()
  @IsString()
  opening_crawl?: string;

  @IsOptional()
  @IsString()
  director?: string;

  @IsOptional()
  @IsString()
  producer?: string;

  @IsOptional()
  @IsString()
  release_date?: string;
}
