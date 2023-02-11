import { Cat } from '../data/cats.schema';
import { multerOptions } from '../../common/utils/multer.options';
import { ApiResponse, ApiOperation } from '@nestjs/swagger';
import { CatsService } from '../service/cats.service';
import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CatRequestDto } from '../data/dto/cats.request.dto';
import { ReadOnlyCatDto } from '../data/dto/cat.dto';
import { AuthService } from '../../auth/auth.service';
import { LoginRequestDto } from '../../auth/jwt/dto/login.request.dto';
import { JwtAuthGuard } from '../../auth/jwt/jwt.guard';
import { CurrentCat } from '../../common/decorators/cat.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('cats')
export class CatsController {
  constructor(
    private readonly catsService: CatsService,
    private readonly authService: AuthService,
  ) {}

  @ApiOperation({ summary: '현재 활성화된 고양이 반환' })
  @Get()
  @UseGuards(JwtAuthGuard)
  getCurrentCat(@CurrentCat() cat) {
    return cat.readOnlyData;
  }

  @ApiResponse({
    status: 201,
    description: 'Succeed to sign up',
    type: ReadOnlyCatDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @ApiOperation({ summary: '회원가입' })
  @Post()
  async signUp(@Body() body: CatRequestDto) {
    return await this.catsService.signUp(body);
  }

  @ApiOperation({ summary: '유저 로그인 수행' })
  @Post('login')
  logIn(@Body() data: LoginRequestDto) {
    return this.authService.jwtLogIn(data);
  }

  @ApiOperation({ summary: '로그아웃 수행' })
  @Post('logout')
  logOut() {
    return 'logout';
  }

  @ApiOperation({ summary: '프로필 이미지 업로드' })
  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('image', 10, multerOptions('cats')))
  uploadCatImg(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @CurrentCat() cat: Cat,
  ) {
    console.log(files);
    return this.catsService.uploadImg(cat, files);
  }

  @ApiOperation({ summary: '모든 고양이 가져오기' })
  @Get('all')
  getAllCat() {
    return this.catsService.getAllCat();
  }
}
