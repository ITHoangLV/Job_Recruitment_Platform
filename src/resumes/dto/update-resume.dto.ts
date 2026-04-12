import { PartialType } from '@nestjs/mapped-types';
import { CreateResumeDto } from './create-resume.dto';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { ResumeStatus } from '../resume.enum';

export class UpdateResumeDto {
  @IsEnum(ResumeStatus, {
    message:
      'Trạng thái không hợp lệ. Phải là: PENDING, REVIEWING, APPROVED hoặc REJECTED',
  })
  status: ResumeStatus;
}
