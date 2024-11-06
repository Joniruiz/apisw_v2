import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { UsuarioEntity } from '../entities/usuario.entity';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;

  const mockUsuarioRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(UsuarioEntity),
          useValue: mockUsuarioRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should return token when credentials are valid', async () => {
      const mockUser = {
        id: 1,
        email: 'test@test.com',
        password: await bcrypt.hash('Password123!', 10),
      };

      mockUsuarioRepository.findOne.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('mockToken');

      const result = await service.login({
        email: 'test@test.com',
        password: 'Password123!',
      });

      expect(result).toHaveProperty('access_token');
    });

    it('should throw error when password is invalid', async () => {
      const mockUser = {
        id: 1,
        email: 'test@test.com',
        password: await bcrypt.hash('Password123!', 10),
      };

      mockUsuarioRepository.findOne.mockResolvedValue(mockUser);

      await expect(
        service.login({
          email: 'test@test.com',
          password: 'wrongpassword',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('validatePassword', () => {
    it('should return true for valid password', async () => {
      const validPassword = 'Password123!';
      expect(await service.validatePassword(validPassword)).toBe(true);
    });

    it('should return false for password without uppercase', async () => {
      const invalidPassword = 'password123!';
      expect(await service.validatePassword(invalidPassword)).toBe(false);
    });

    it('should return false for password without lowercase', async () => {
      const invalidPassword = 'PASSWORD123!';
      expect(await service.validatePassword(invalidPassword)).toBe(false);
    });

    it('should return false for password without numbers', async () => {
      const invalidPassword = 'Password!';
      expect(await service.validatePassword(invalidPassword)).toBe(false);
    });

    it('should return false for password without special characters', async () => {
      const invalidPassword = 'Password123';
      expect(await service.validatePassword(invalidPassword)).toBe(false);
    });

    it('should return false for short password', async () => {
      const invalidPassword = 'Pass1!';
      expect(await service.validatePassword(invalidPassword)).toBe(false);
    });
  });
});
