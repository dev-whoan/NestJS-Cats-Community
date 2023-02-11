import { Comments } from './../../comments/data/comments.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cat } from './cats.schema';
import { CatRequestDto } from './dto/cats.request.dto';

@Injectable()
export class CatsRepository {
  constructor(
    @InjectModel(Cat.name) private readonly catModel: Model<Cat>,
    @InjectModel(Comments.name) private readonly commentsModel: Model<Comments>,
  ) {}

  async findAll(): Promise<Cat[]> {
    // const CommentsModel = mongoose.model('comments', CommentsSchema);

    const result = await this.catModel
      .find()
      .populate({ path: 'comments', model: this.commentsModel });

    return result;
    // return await this.catModel.find();
  }

  async existsByEmail(email: string): Promise<boolean> {
    // try {
    const result = await this.catModel.exists({ email });
    return !!result;
    // } catch (error ){
    //     throw new HttpException('db error', 500);
    // }
  }

  async create(cat: CatRequestDto): Promise<Cat> {
    return await this.catModel.create(cat);
  }

  async findCatByEmail(email: string): Promise<Cat | null> {
    const cat = await this.catModel.findOne({ email });
    return cat;
  }

  async findCatByIdWithoutPassword(
    catid: string | Types.ObjectId,
  ): Promise<Cat | null> {
    //* 보안상 password를 제외하고 가져온다.
    //* select('-EXCLUDE_FIELD')
    //* select('filed1 filed2')
    const cat = await this.catModel.findById(catid).select('-password');
    return cat;
  }

  async findByIdAndUpdateImg(id: string, fileName: string) {
    const cat = await this.catModel.findById(id);
    //* 해당 고양이 image url 설정
    //* fileName -> 해당 이미지는 방금 업로드 된 값
    cat.imgUrl = `http://localhost:8000/media/${fileName}`;

    //* 고양이 DB 저장
    const newCat = await cat.save();
    return newCat.readOnlyData;
  }
}
