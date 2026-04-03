import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import { emitWarning } from 'process';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from './users.interface';
import { createDeflate } from 'zlib';
import aqp from 'api-query-params';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>,
  ) {}

  getHashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  };

  async create(createUserDto: CreateUserDto, user: IUser) {
    const hashPassword = this.getHashPassword(createUserDto.password);
    const isExist = await this.userModel.findOne({ email: createUserDto.email });
    if (isExist) {
      throw new BadRequestException(`Email ${createUserDto.email} đã tồn tại trên hệ thống!`);
    }
    const newUser = await this.userModel.create({
      email: createUserDto.email,
      password: hashPassword,
      name: createUserDto.name,
      age: createUserDto.age,
      gender: createUserDto.gender,
      address: createUserDto.address,
      role: createUserDto.role,
      company: createUserDto.company,
      createdBy: { 
        _id: user._id,
        email: user.email,
       },
    });
    // console.log(user);
    return {
      _id: newUser._id,
      createdAt: newUser.createdAt
    };
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.page;
    delete filter.limit;
    const offset = (+currentPage - 1) * +limit;
    const defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.userModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .select('-password')
      .populate(population)
      .exec();

    return {
      meta: {
        current: currentPage, //trang hiện tại
        pageSize: limit, //số lượng bản ghi đã lấy
        pages: totalPages, //tổng số trang với điều kiện query
        total: totalItems, // tổng số phần tử (số bản ghi)
      },
      result, //kết quả query
    };
  }

  async findOne(id: string) {
    return await this.userModel.findById(id).select('-password');
  }

  findOneByUsername(username: string) {
    return this.userModel.findOne({
      email: username,
    });
  }

  isValidePassword(password: string, hash: string) {
    return compareSync(password, hash);
  }

  async update(updateUserDto: UpdateUserDto, user: IUser) {
    return await this.userModel.updateOne(
          {_id: updateUserDto._id },
      { 
      ...UpdateUserDto, 
      updatedBy: {
        _id: user._id,
        email: user.email,
      },
    }
    );
  }

  async remove(id: string, user: IUser) {
    await this.userModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return await this.userModel.softDelete({ _id: id });
  }

  async register(user: RegisterUserDto) {
    const {name , email, password, age, gender, address} = user;
    const isExist = await this.userModel.findOne({ email });
    if (isExist) {
      throw new BadRequestException(`Email ${email} đã tồn tại trên hệ thống!`);
    }
    const hashPassword = await this.getHashPassword(password);
    let newUser = await this.userModel.create({
      name,
      email,
      password: hashPassword,
      age,
      gender,
      address,
      role: 'USER',
    });
    return newUser;
  }


  updateUserToken = async (refreshToken: string, _id : string) => {
    return await this.userModel.updateOne(
      { _id },
      {
        refreshToken,
      },
    );

  }
}
