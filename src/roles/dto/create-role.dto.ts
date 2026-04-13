import { IsArray, IsBoolean, IsMongoId, IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class CreateRoleDto {
  @IsNotEmpty({ message: 'name không được để trống' })
  name: string;

  @IsNotEmpty({ message: 'description không được để trống' })
  description: string;

  @IsNotEmpty({ message: 'isActive không được để trống' })
  @IsBoolean({ message: 'isActive phải là boolean' })
  isActive: boolean;

  @IsNotEmpty({ message: 'permissions không được để trống' })
  @IsArray({ message: 'permissions phải là một mảng' })
  @IsMongoId({ each: true, message: 'permissions phải là một mảng ObjectId' })
  permissions: mongoose.Schema.Types.ObjectId[];
}
