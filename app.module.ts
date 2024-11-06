import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StarWarsModule } from './modules/starwars.module';
import { AuthModule } from './modules/auth.module';
import { UsuarioEntity } from './entities/usuario.entity';
import { PeliculaEntity } from './entities/pelicula.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [UsuarioEntity, PeliculaEntity],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    StarWarsModule,
    AuthModule,
  ],
})
export class AppModule {}
