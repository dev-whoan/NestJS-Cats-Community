import { AuthService } from './../../auth/auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { CatsService } from '../service/cats.service';
import { CatsController } from './cats.controller';
import { CatsRepository } from '../data/cats.repository';
import { JwtService } from '@nestjs/jwt';

describe('Unit Test', () => {
  let authService: AuthService;
  let jwtService: JwtService;
  let catsRepository: CatsRepository;
  let catsController: CatsController;
  let catsService: CatsService;

  beforeEach(async () => {
    jwtService = new JwtService({
      secret: 'abcdef.1234567890abcdef',
      signOptions: { expiresIn: '1y' },
    });
    authService = new AuthService(catsRepository, jwtService);
    catsService = new CatsService(catsRepository);
    catsController = new CatsController(catsService, authService);
  });

  it('should be defined', () => {
    expect(catsController).toBeDefined();
  });
});
