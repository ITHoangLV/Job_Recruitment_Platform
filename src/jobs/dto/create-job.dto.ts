import { Transform, Type } from 'class-transformer';
import { IsArray, IsDate, IsNotEmpty, IsObject, IsString, ValidateNested } from 'class-validator';
import mongoose from 'mongoose';

class Company {
  @IsNotEmpty()
  _id: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty()
  name: string;
}

export class CreateJobDto {
  @IsNotEmpty({message: 'Tên không được để trống'})
  name: string;

  @IsNotEmpty({message: 'Skill không được để trống'})
  @IsArray()
  @IsString({ each: true, message: 'Skill định dạng string' })
  skill: string[];

  @IsNotEmpty()
  @ValidateNested()
  @IsObject()
  @Type(() => Company)
  company: Company;

  @IsNotEmpty()
  location: string;

  @IsNotEmpty()
  salary: number;

  @IsNotEmpty()
  quantity: number;

  @IsNotEmpty()
  level: string;

  @IsNotEmpty()
  description: string;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  @IsNotEmpty()
  startDate: Date;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  @IsNotEmpty()
  endDate: Date;
}
