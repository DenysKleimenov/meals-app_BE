import {
  Controller,
  Post,
  Body,
  UseGuards,
  Param,
  Get,
  NotFoundException,
  Res,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { UserDto } from 'src/dto/user.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { DoesUserExist } from 'src/guards/doesUserExist.guard';
import EmailService from 'src/email/email.service';
import { v4 as uuidv4 } from 'uuid';
import { UsersService } from 'src/users/users.service';
import { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async login(
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { user, token } = await this.authService.login(req.user);
    const { COOKIE_EXPIRATION, MINUTES, HOURS, DAYS } = process.env;
    // eslint-disable-next-line prettier/prettier
    const expiration =
      Number(COOKIE_EXPIRATION) *
      Number(MINUTES) *
      Number(HOURS) *
      Number(DAYS);

    response.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      expires: new Date(Date.now() + expiration),
    });

    return user;
  }

  @UseGuards(DoesUserExist)
  @Post('signup')
  async signUp(@Body() user: Omit<UserDto, 'activationToken'>) {
    const activationToken = uuidv4();

    const createdUser = await this.authService.create({
      ...user,
      activationToken,
    });

    this.emailService.sendActivationLink(user.email, activationToken);

    return createdUser;
  }

  @Post('activation')
  async checkActivation(@Body() body: { email: string }) {
    const { activationToken } = await this.authService.checkActivation(
      body.email,
    );

    if (activationToken) {
      throw new ForbiddenException('Account is not activated');
    }

    return true;
  }

  @Get('activation/:activationToken')
  async activate(@Param('activationToken') activationToken: string) {
    const user = await this.usersService.findOneByToken(activationToken);

    if (!user) {
      throw new NotFoundException('Could not find user');
    }

    user.activationToken = null;
    await user.save();

    return user;
  }
}
