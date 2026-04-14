import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Permission } from 'src/permissions/schemas/permission.schema';
import { PermissionDocument } from 'src/permissions/schemas/permission.schema';
import { Role } from 'src/roles/schemas/role.schema';
import { RoleDocument } from 'src/roles/schemas/role.schema';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import { ADMIN_ROLE, USER_ROLE, INIT_PERMISSIONS } from './sample';

@Injectable()
export class DatabasesService implements OnModuleInit {
  private readonly logger = new Logger(DatabasesService.name);
  constructor(
    @InjectModel(User.name)
    private userModel: SoftDeleteModel<UserDocument>,

    @InjectModel(Permission.name)
    private permissionModel: SoftDeleteModel<PermissionDocument>,

    @InjectModel(Role.name)
    private roleModel: SoftDeleteModel<RoleDocument>,

    private configService: ConfigService,
    private userService: UsersService,
  ) {}

  async onModuleInit() {
    const isInit = this.configService.get<string>('SHOULD_INIT');
    if (Boolean(isInit)) {
      const countUser = await this.userModel.count({});
      const countPermission = await this.permissionModel.count({});
      const countRole = await this.roleModel.count({});

      if (countPermission === 0) {
        await this.permissionModel.insertMany(INIT_PERMISSIONS);
      }

      if (countRole === 0) {
        const permissions = await this.permissionModel.find({}).select('_id');
        await this.roleModel.insertMany([
          {
            name: ADMIN_ROLE,
            description: 'Admin full quyền',
            isActive: true,
            permissions: permissions,
          },
          {
            name: USER_ROLE,
            description: 'User role',
            isActive: true,
            permissions: [],
          },
        ]);
      }

      if (countUser === 0) {
        const adminRole = await this.roleModel.findOne({ name: ADMIN_ROLE });
        const userRole = await this.roleModel.findOne({ name: USER_ROLE });
        await this.userModel.insertMany([
          {
            name: 'Admin',
            email: 'admin@gmail.com',
            password: await this.userService.getHashPassword(
              this.configService.get<string>('INIT_PASSWORD'),
            ),
            age: 30,
            gender: 'male',
            address: 'Hanoi',
            role: adminRole._id,
          },
          {
            name: 'User',
            email: 'user@gmail.com',
            password: await this.userService.getHashPassword(
              this.configService.get<string>('INIT_PASSWORD'),
            ),
            age: 25,
            gender: 'female',
            address: 'Ho Chi Minh City',
            role: userRole._id,
          },
        ]);
      }

      if (countPermission > 0 || countRole > 0 || countUser > 0) {
        this.logger.log('>>> ALREADY INIT SAMPLE DATA');
      }
    }
  }
}
