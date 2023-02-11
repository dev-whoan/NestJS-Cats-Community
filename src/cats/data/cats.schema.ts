import { Comments } from './../../comments/data/comments.schema';
import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Document } from 'mongoose';

const options: SchemaOptions = {
  //* MongoDB 아래에 생성될 collection 이름 지정
  //* 지정 안하면 class 첫글자 소문자, 제일 마지막에 s 붙임
  //* Cat -> cats
  collection: 'cats',
  timestamps: true,
};

@Schema(options)
export class Cat extends Document {
  @ApiProperty({
    example: 'catmail@mail.com',
    description: 'Email Address',
    required: true,
  })
  @Prop({
    required: true,
    unique: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'Ggami',
    description: 'Cat Name',
    required: true,
  })
  @Prop({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'a1s2d3',
    description: 'Password',
    required: true,
  })
  @Prop({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @Prop({
    required: false,
    default:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTllXXqOuWSuNI5xjhD3Ujytatdy18X1sXH5_tVGeHU7A&s',
  })
  @IsString()
  imgUrl: string;

  readonly readOnlyData: {
    id: string;
    email: string;
    name: string;
    imgUrl: string;
    comments: Comments[];
  };

  readonly comments: Comments[];
}

//*
const _CatSchema = SchemaFactory.createForClass(Cat);

_CatSchema.virtual('readOnlyData').get(function (this: Cat) {
  return {
    id: this.id,
    email: this.email,
    name: this.name,
    imgUrl: this.imgUrl,
    comments: this.comments,
  };
});

//* Comments라는 Virtual Field 추가
//* list 형태로 해당하는 모든 comment를 담기 위한 virutal field
//* virtual field명은 아무렇게나 해도 됨. 본 요청 응답할 때 반환될 key 명임
_CatSchema.virtual('comments', {
  //* schema (Collection 이름) -> comments.schema.ts -> SchemaOptions.collection
  ref: 'comments',
  //*
  localField: '_id',
  //* DB에서의 그 외래키. comments에 info라는 필드는 Cats의 _id와 연관있다
  foreignField: 'info',
});

//* Populate를 위해 주는 옵션
//* RDB의 JOIN문.
_CatSchema.set('toObject', { virtuals: true });
_CatSchema.set('toJSON', { virtuals: true });

export const CatSchema = _CatSchema;
