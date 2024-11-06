import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StarWarsController } from '../controllers/starwars.controller';
import { StarWarsService } from '../services/starwars.service';
import { PeliculaEntity } from '../entities/pelicula.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([PeliculaEntity])],
  controllers: [StarWarsController],
  providers: [StarWarsService],
})
export class StarWarsModule {}
