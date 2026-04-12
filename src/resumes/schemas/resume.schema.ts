import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { ResumeStatus } from '../resume.enum';
import { Company } from 'src/companies/schemas/company.schema';
import { Job } from 'src/jobs/entities/job.entity';

export type ResumeDocument = HydratedDocument<Resume>;

@Schema({ timestamps: true })
export class Resume {
  @Prop()
  email: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop()
  url: string;

  @Prop({ type: String, enum: ResumeStatus, default: ResumeStatus.PENDING })
  status: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Company.name })
  company: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Job.name })
  job: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: [
      {
        status: { type: String, enum: ResumeStatus },
        updatedAt: { type: Date },
        updatedBy: {
          _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
          email: { type: String },
        },
      },
    ],
  })
  history: Record<string, any>[];

  @Prop({ type: Object })
  createdBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };

  @Prop({ type: Object })
  updatedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };

  @Prop({ type: Object })
  deletedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  isDeleted: boolean;

  @Prop()
  deletedAt: Date;
}

export const ResumeSchema = SchemaFactory.createForClass(Resume);
