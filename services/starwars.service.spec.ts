import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { getRepositoryToken } from '@nestjs/typeorm';
import { StarWarsService } from './starwars.service';
import { PeliculaEntity } from '../entities/pelicula.entity';
import { of } from 'rxjs';
import { NotFoundException } from '@nestjs/common';

describe('StarWarsService', () => {
  let service: StarWarsService;
  let httpService: HttpService;

  const mockPeliculaRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  const mockHttpService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StarWarsService,
        {
          provide: getRepositoryToken(PeliculaEntity),
          useValue: mockPeliculaRepository,
        },
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
      ],
    }).compile();

    service = module.get<StarWarsService>(StarWarsService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('obtenerPeliculas', () => {
    it('should return movies from database if they exist', async () => {
      const mockPeliculas = [
        { id: 1, titulo: 'Star Wars: A New Hope' },
        { id: 2, titulo: 'The Empire Strikes Back' },
      ];

      mockPeliculaRepository.find.mockResolvedValue(mockPeliculas);

      const result = await service.obtenerPeliculas();

      expect(result.datos).toEqual(mockPeliculas);
      expect(result.mensaje).toBe('Películas obtenidas con éxito');
      expect(mockHttpService.get).not.toHaveBeenCalled();
    });

    it('should fetch movies from API if database is empty', async () => {
      const mockApiResponse = {
        results: [
          { title: 'A New Hope', episode_id: 4 },
          { title: 'Empire Strikes Back', episode_id: 5 },
        ],
      };

      mockPeliculaRepository.find.mockResolvedValue([]);
      mockHttpService.get.mockReturnValue(of({ data: mockApiResponse }));
      mockPeliculaRepository.create.mockImplementation((dto) => dto);
      mockPeliculaRepository.save.mockImplementation((dto) => dto);

      const result = await service.obtenerPeliculas();

      expect(mockHttpService.get).toHaveBeenCalled();
      expect(result.mensaje).toBe('Películas obtenidas con éxito');
      expect(mockPeliculaRepository.save).toHaveBeenCalled();
    });
  });

  describe('obtenerPeliculaPorId', () => {
    it('should return a movie if found', async () => {
      const mockPelicula = { id: 1, titulo: 'Star Wars: A New Hope' };
      mockPeliculaRepository.findOne.mockResolvedValue(mockPelicula);

      const result = await service.obtenerPeliculaPorId(1);

      expect(result.datos).toEqual(mockPelicula);
      expect(result.mensaje).toBe('Película encontrada');
    });
  });

  describe('crearPelicula', () => {
    it('should create a new movie', async () => {
      const createDto = {
        title: 'Nueva Película',
        episode_id: 7,
        opening_crawl: 'Text text text...',
        director: 'Director',
        producer: 'Producer',
        release_date: '2024-03-20',
      };

      const mockCreatedPelicula = { id: 1, ...createDto };

      mockPeliculaRepository.create.mockReturnValue(mockCreatedPelicula);
      mockPeliculaRepository.save.mockResolvedValue(mockCreatedPelicula);

      const result = await service.crearPelicula(createDto);

      expect(result).toEqual(mockCreatedPelicula);
      expect(mockPeliculaRepository.create).toHaveBeenCalledWith(createDto);
      expect(mockPeliculaRepository.save).toHaveBeenCalled();
    });
  });

  describe('actualizarPelicula', () => {
    it('should update an existing movie', async () => {
      const updateDto = { title: 'Título Actualizado' };
      const existingPelicula = {
        id: 1,
        title: 'Título Original',
        director: 'Director',
        release_date: new Date(),
        episode_id: 4,
      };
      const updatedPelicula = { ...existingPelicula, ...updateDto };

      mockPeliculaRepository.findOne.mockResolvedValue(existingPelicula);
      mockPeliculaRepository.save.mockResolvedValue(updatedPelicula);

      const result = await service.actualizarPelicula(1, updateDto);

      expect(result).toEqual(updatedPelicula);
    });

    it('should throw NotFoundException if movie not found', async () => {
      mockPeliculaRepository.findOne.mockResolvedValue(null);

      await expect(
        service.actualizarPelicula(999, { title: 'Test' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('eliminarPelicula', () => {
    it('should delete an existing movie', async () => {
      const mockPelicula = { id: 1, titulo: 'Película a eliminar' };
      mockPeliculaRepository.findOne.mockResolvedValue(mockPelicula);
      mockPeliculaRepository.remove.mockResolvedValue(mockPelicula);

      const result = await service.eliminarPelicula(1);

      expect(result.message).toContain('eliminada exitosamente');
      expect(mockPeliculaRepository.remove).toHaveBeenCalledWith(mockPelicula);
    });

    it('should throw NotFoundException if movie not found', async () => {
      mockPeliculaRepository.findOne.mockResolvedValue(null);

      await expect(service.eliminarPelicula(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
