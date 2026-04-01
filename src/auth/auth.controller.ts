import {
  Controller,
  Get,
  Render,
  UseGuards,
  Request,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from 'src/decorator/customize';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth') // routes
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  handlelogin(@Request() req) {
    return this.authService.login(req.user);
  }

  // @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
