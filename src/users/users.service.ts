import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import { emitWarning } from 'process';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  getHashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  };

  async create(createUserDto: CreateUserDto) {
    const hashPassword = this.getHashPassword(createUserDto.password);
    console.log(hashPassword);
    const user = await this.userModel.create({
      email: createUserDto.email,
      password: hashPassword,
      name: createUserDto.name,
    });
    console.log(user);
    return user;
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: string) {
    return this.userModel.findOne({
      _id: id,
    });
  }

  findOneByUsername(username: string) {
    return this.userModel.findOne({
      email: username,
    });
  }

  isValidePassword(password: string, hash: string) {
    return compareSync(password, hash);
  }

  async update(updateUserDto: UpdateUserDto) {
    return await this.userModel.updateOne(
      { _id: updateUserDto._id },
      { ...updateUserDto },
    );
  }

  async remove(id: string) {
    console.log(id);
    return await this.userModel.deleteOne({ id: id });
  }
}
