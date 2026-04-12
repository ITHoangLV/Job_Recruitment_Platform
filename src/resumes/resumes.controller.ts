import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';

@Controller('resumes')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  @ResponseMessage('Create a new resume')
  @Post()
  create(@Body() createResumeDto: CreateResumeDto, @User() user) {
    return this.resumesService.create(createResumeDto, user);
  }

  @Get()
  @ResponseMessage('Fetch all resumes with paginate')
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: any,
  ) {
    return this.resumesService.findAll(+currentPage, +limit, qs);
  }

  @ResponseMessage('Get Resumes by User')
  @Post('by-user')
  getResumesByUser(@User() user: IUser) {
    return this.resumesService.getResumesByUser(user);
  }

  @ResponseMessage('Fetch a resume by id')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.resumesService.findOne(id);
  }

  @ResponseMessage('Update status resume')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateResumeDto: UpdateResumeDto,
    @User() user: IUser,
  ) {
    return this.resumesService.update(id, updateResumeDto, user);
  }

  @ResponseMessage('Delete a resume by id')
  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.resumesService.remove(id, user);
  }
}
