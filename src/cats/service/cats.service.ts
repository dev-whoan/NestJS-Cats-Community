import { HttpException, Injectable } from '@nestjs/common';
import { Cat } from '../data/cats.schema';
import { CatRequestDto } from '../data/dto/cats.request.dto';
import * as bcrypt from 'bcrypt';
import { CatsRepository } from '../data/cats.repository';

@Injectable()
export class CatsService {
  //* constructor (@InjectModel(Cat.name) private readonly catModel: Model<Cat>) {}
  constructor(private readonly catsRepository: CatsRepository) {}

  async getAllCat() {
    // const cats = await this.catsRepository.findAll();
    // const readOnlyCats = cats.map((cat) => cat.readOnlyData);
    const allCat = await this.catsRepository.findAll();
    const readOnlyCats = allCat.map((cat) => cat.readOnlyData);

    return readOnlyCats;
  }

  async signUp(body: CatRequestDto) {
    //* body에서 email, name, password 사용
    const { email, name, password } = body;
    //* DB에 해당하는 이메일의 존재 확인
    //* const isCatExist = await this.catModel.exists({ email });
    const isCatExist = await this.catsRepository.existsByEmail(email);

    //* 이미 존재할 경우 예외 처리
    if (isCatExist) {
      throw new HttpException('해당하는 고양이는 이미 존재합니다.', 409);
    }

    //* 요청된 password는 암호화되어 저장해야 함
    const hashedPassword = await bcrypt.hash(password, 10);
    const cat = await this.catsRepository.create({
      email,
      name,
      password: hashedPassword,
    });

    return cat.readOnlyData;
  }

  async uploadImg(cat: Cat, files: Express.Multer.File[]) {
    //* 업로드 된 파일 이름 획득
    const fileName = `cats/${files[0].filename}`;

    //* cat.id와 일치하는 고양이의 파일 변경
    const newCat = await this.catsRepository.findByIdAndUpdateImg(
      cat.id,
      fileName,
    );

    return newCat;
  }
}
