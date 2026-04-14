import {
  Controller,
  UseGuards,
  Post,
  Body,
  Res,
  Req,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { LocalAuthGuard } from './local-auth.guard';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { Response, Request } from 'express';
import { IUser } from 'src/users/users.interface';
import { RolesService } from 'src/roles/roles.service';

@Controller('auth') // routes
export class AuthController {
  constructor(
    private authService: AuthService,
    private rolesService: RolesService,
  ) {}

  @Public()
  @ResponseMessage('User login')
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  handlelogin(@Req() req, @Res({ passthrough: true }) response: Response) {
    return this.authService.login(req.user, response);
  }

  @ResponseMessage('Register a new user')
  @Public()
  @Post('/register')
  handleregister(@Body() registerUser: RegisterUserDto) {
    return this.authService.register(registerUser);
  }

  @ResponseMessage('Get user information')
  @Get('/account')
  async handleGetAccount(@User() user: IUser) {
    const temp = (await this.rolesService.findOne(user.role._id)) as any;
    user.permissions = temp.permissions;
    return user;
  }

  @Public()
  @ResponseMessage('Get user by refresh token')
  @Get('/refresh')
  handleRefreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = req.cookies['refresh_token'];
    return this.authService.processNewToken(refreshToken, response);
  }

  @ResponseMessage('User logout')
  @Post('/logout')
  handleLogout(
    @User() user: IUser,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.logout(user, response);
  }
}
