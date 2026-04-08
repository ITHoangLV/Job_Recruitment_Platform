import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose/dist/soft-delete-model';
import { Job } from './entities/job.entity';
import { InjectModel } from '@nestjs/mongoose/dist/common/mongoose.decorators';
import { JobDocument } from './schemas/job.schema';
import { IUser } from 'src/users/users.interface';
import aqp from 'api-query-params';

@Injectable()
export class JobsService {
    constructor(
      @InjectModel(Job.name) private jobModel: SoftDeleteModel<JobDocument>,
    ) {}
  async create(createJobDto: CreateJobDto, user: IUser) {
    const jobNew = await this.jobModel.create({
      name: createJobDto.name,
      skill: createJobDto.skill,
      company: createJobDto.company,
      location: createJobDto.location,
      salary: createJobDto.salary,
      quantity: createJobDto.quantity,
      level: createJobDto.level,
      description: createJobDto.description,
      startDate: createJobDto.startDate,
      endDate: createJobDto.endDate,
      isActive: true,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
    return {
      _id: jobNew._id,
      createAt: jobNew.createdAt,
    };
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    const offset = (+currentPage - 1) * +limit;
    const defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.jobModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.jobModel
      .find(filter)
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
    const job = await this.jobModel.findOne({
      _id: id,
      isDeleted: false
    })
    if (!job){
      throw new NotFoundException(`Không tồn tại job với ID: ${id}`)
    }
    return job;
  }

async update(id: string, updateJobDto: UpdateJobDto, user: IUser) {
  return await this.jobModel.updateOne(
    {
      _id: id
    },
    {
      ...updateJobDto,
      updatedBy: {
        _id: user._id,
        email: user.email,
      }
    }
  );
}

 async remove(id: string, user: IUser) {
    const job = await this.jobModel.updateOne(
      {_id: id },
      {
        deletedBy:{
          _id: user._id,
          email: user.email,
        }
      }
    )
    console.log(job);
    return this.jobModel.softDelete({_id: id});
  }
}
