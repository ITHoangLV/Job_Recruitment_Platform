import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { IUser } from 'src/users/users.interface';
import { Resume, ResumeDocument } from './schemas/resume.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose/dist/soft-delete-model';
import { InjectModel } from '@nestjs/mongoose/dist/common/mongoose.decorators';
import { use } from 'passport';
import aqp from 'api-query-params';
import { ResumeStatus } from './resume.enum';
import mongoose, { mongo } from 'mongoose';

@Injectable()
export class ResumesService {
  constructor(
    @InjectModel(Resume.name)
    private resumeModel: SoftDeleteModel<ResumeDocument>,
  ) {}

  async create(createResumeDto: CreateResumeDto, user: IUser) {
    const newCV = await this.resumeModel.create({
      email: user.email,
      userId: user._id,
      status: ResumeStatus.PENDING,
      ...createResumeDto,
      history: [
        {
          status: ResumeStatus.PENDING,
          upDateAt: new Date(),
          updatedBy: {
            _id: user._id,
            email: user.email,
          },
        },
      ],
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
    return {
      _id: newCV?._id,
      createAt: newCV?.createdAt,
    };
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population, projection } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    const offset = (+currentPage - 1) * +limit;
    const defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.resumeModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.resumeModel
      .find(filter)
      .select(projection as any)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
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
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Not found');
    }
    return await this.resumeModel.findById(id).exec();
  }

  async update(id: string, updateResumeDto: UpdateResumeDto, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Not found');
    }
    return await this.resumeModel.updateOne(
      { _id: id },
      {
        status: updateResumeDto.status,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
        $push: {
          history: {
            status: updateResumeDto.status,
            updatedAt: new Date(), // Lưu ý: Tôi đã sửa upDateAt thành updatedAt cho chuẩn naming convention
            updatedBy: {
              _id: user._id,
              email: user.email,
            },
          },
        },
      },
    );
  }

  async remove(id: string, user: IUser) {
    await this.resumeModel.updateOne(
      {
        _id: id,
      },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return await this.resumeModel.softDelete({ _id: id });
  }

  getResumesByUser(user: IUser) {
    return this.resumeModel.find({
      userId: user._id,
    });
  }
}
