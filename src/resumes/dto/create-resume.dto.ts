import { IsEmail, IsMongoId, IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class CreateResumeDto {
  @IsNotEmpty({ message: 'url không được để trống' })
  url: string;

  @IsMongoId({ message: 'companyId phải là một ObjectId hợp lệ' })
  @IsNotEmpty({ message: 'companyId không được để trống' })
  companyId: mongoose.Schema.Types.ObjectId;

  @IsMongoId({ message: 'jobId phải là một ObjectId hợp lệ' })
  @IsNotEmpty({ message: 'jobId  không được để trống' })
  jobId: mongoose.Schema.Types.ObjectId;
}
