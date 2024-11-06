import { StarWarsService } from '../services/starwars.service';
import { CrearPeliculaDto } from 'src/dto/crear-pelicula.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Put,
  Delete,
  UseGuards,
  SetMetadata,
} from '@nestjs/common';
import { ActualizarPeliculaDto } from 'src/dto/actualizar-pelicula.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('peliculas')
@Controller('starwars')
export class StarWarsController {
  constructor(private readonly starWarsService: StarWarsService) {}

  @Get('peliculas')
  @ApiResponse({
    status: 200,
    description: 'Lista de películas obtenida exitosamente',
  })
  async obtenerPeliculas() {
    return await this.starWarsService.obtenerPeliculas();
  }

  @Get('peliculas/:id')
  @ApiOperation({ summary: 'Obtener una película por ID' })
  @ApiParam({ name: 'id', description: 'ID de la película' })
  @ApiResponse({
    status: 200,
    description: 'Película encontrada',
  })
  @ApiResponse({
    status: 404,
    description: 'Película no encontrada',
  })
  async obtenerPeliculaPorId(@Param('id', ParseIntPipe) id: number) {
    return await this.starWarsService.obtenerPeliculaPorId(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', ['admin'])
  @Post('peliculas')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear una nueva película' })
  @ApiResponse({
    status: 201,
    description: 'Película creada exitosamente',
  })
  async crearPelicula(@Body() crearPeliculaDto: CrearPeliculaDto) {
    return await this.starWarsService.crearPelicula(crearPeliculaDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', ['admin'])
  @Put('peliculas/:id')
  async actualizarPelicula(
    @Param('id', ParseIntPipe) id: number,
    @Body() peliculaDto: ActualizarPeliculaDto,
  ) {
    return await this.starWarsService.actualizarPelicula(id, peliculaDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', ['admin'])
  @Delete('peliculas/:id')
  async eliminarPelicula(@Param('id', ParseIntPipe) id: number) {
    return await this.starWarsService.eliminarPelicula(id);
  }
}
