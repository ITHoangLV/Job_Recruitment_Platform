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

@Controller('auth') // routes
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @ResponseMessage('User login')
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  handlelogin(
    @Req() req,
    @Res({ passthrough: true }) response: Response) {
    return this.authService.login(req.user,response);
  }

  @ResponseMessage('Register a new user')
  @Public()
  @Post('/register')
  handleregister(@Body() registerUser: RegisterUserDto) {
    return this.authService.register(registerUser);
  }

  @ResponseMessage("Get user information")
  @Get('/account')
  handleGetAccount(@User() user: IUser) {
    return { user };
  }
}
