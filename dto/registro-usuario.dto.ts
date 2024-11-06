import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegistroUsuarioDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
