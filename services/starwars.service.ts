import { Injectable, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PeliculaEntity } from '../entities/pelicula.entity';
import { firstValueFrom } from 'rxjs';
import { CrearPeliculaDto } from 'src/dto/crear-pelicula.dto';
import { ActualizarPeliculaDto } from 'src/dto/actualizar-pelicula.dto';

@Injectable()
export class StarWarsService {
  private readonly baseUrl = 'https://swapi.dev/api';

  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(PeliculaEntity)
    private peliculaRepository: Repository<PeliculaEntity>,
  ) {}

  async obtenerPeliculas() {
    try {
      // Primero intentamos obtener de la base de datos
      let peliculas = await this.peliculaRepository.find();

      // Si no hay películas en la BD, las obtenemos de la API
      if (peliculas.length === 0) {
        const { data } = await firstValueFrom(
          this.httpService.get(`${this.baseUrl}/films`),
        );

        // Guardamos las películas en la base de datos
        const peliculasParaGuardar = data.results.map((pelicula) =>
          this.peliculaRepository.create(pelicula),
        );

        peliculas = await this.peliculaRepository.save(peliculasParaGuardar);
      }

      return {
        mensaje: 'Películas obtenidas con éxito',
        datos: peliculas,
      };
    } catch (error) {
      throw {
        error: true,
        mensaje: `Error al obtener las películas ${error}`,
      };
    }
  }

  async obtenerPeliculaPorId(id: number) {
    try {
      const pelicula = await this.peliculaRepository.findOne({
        where: { id },
      });

      if (!pelicula) {
        throw new Error('Película no encontrada');
      }

      return {
        mensaje: 'Película encontrada',
        datos: pelicula,
      };
    } catch (error) {
      throw {
        error: true,
        mensaje: error.message || 'Error al obtener la película',
      };
    }
  }

  async crearPelicula(
    crearPeliculaDto: CrearPeliculaDto,
  ): Promise<PeliculaEntity> {
    const nuevaPelicula = this.peliculaRepository.create(crearPeliculaDto);
    return await this.peliculaRepository.save(nuevaPelicula);
  }

  async actualizarPelicula(id: number, peliculaDto: ActualizarPeliculaDto) {
    const pelicula = await this.peliculaRepository.findOne({ where: { id } });

    if (!pelicula) {
      throw new NotFoundException(`Película con ID ${id} no encontrada`);
    }

    Object.assign(pelicula, peliculaDto);
    return await this.peliculaRepository.save(pelicula);
  }

  async eliminarPelicula(id: number) {
    const pelicula = await this.peliculaRepository.findOne({ where: { id } });

    if (!pelicula) {
      throw new NotFoundException(`Película con ID ${id} no encontrada`);
    }

    await this.peliculaRepository.remove(pelicula);
    return { message: `Película con ID ${id} eliminada exitosamente` };
  }
}
