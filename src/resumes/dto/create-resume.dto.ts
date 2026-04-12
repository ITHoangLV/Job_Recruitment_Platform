import { IsEmail, IsMongoId, IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class CreateResumeDto {
  @IsNotEmpty({ message: 'url không được để trống' })
  url: string;

  @IsMongoId({ message: 'company phải là một ObjectId hợp lệ' })
  @IsNotEmpty({ message: 'company không được để trống' })
  company: mongoose.Schema.Types.ObjectId;

  @IsMongoId({ message: 'job phải là một ObjectId hợp lệ' })
  @IsNotEmpty({ message: 'job không được để trống' })
  job: mongoose.Schema.Types.ObjectId;
}
