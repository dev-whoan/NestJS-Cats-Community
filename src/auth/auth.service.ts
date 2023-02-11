import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CatsRepository } from 'src/cats/data/cats.repository';
import { LoginRequestDto } from './jwt/dto/login.request.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  //* Email, Password를 통해 로그인 수행
  //* 해당 내용이 DB에 존재하는가, 서로 옳은 내용인가 유효성 검사
  //* 이를 위한 Dependency Injection
  //* JwtService는 auth.module 아래의 JwtModule.register ... 를 통해 사용 가능
  constructor(
    private readonly catsRepository: CatsRepository,
    private jwtService: JwtService,
  ) {}

  async jwtLogIn(data: LoginRequestDto) {
    //* 비구조화 할당을 통한 data 정의
    const { email, password } = data;

    const cat = await this.catsRepository.findCatByEmail(email);

    if (!cat) {
      throw new UnauthorizedException('이메일과 비밀번호를 확인해주세요.');
    }

    //* 비밀번호 검사
    //* 이미 cat 안에는 password가 있다.
    //* 실제로는 front에서 아예 해시화 하여 비교
    const isPasswordValidated: boolean = await bcrypt.compare(
      password,
      cat.password,
    );

    if (!isPasswordValidated) {
      throw new UnauthorizedException('이메일과 비밀번호를 확인해주세요.');
    }

    //* JWT 반환
    const payload = { email: email, sub: cat.id };

    return {
      token: this.jwtService.sign(payload),
    };
  }
}
