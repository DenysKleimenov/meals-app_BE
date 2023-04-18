import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { CookiesService } from './cookies.service';

@Controller('cookies')
export class CookiesController {
  constructor(private readonly cookiesService: CookiesService) {}

  @Get('checking')
  checkCookies(@Req() req: Request) {
    return this.cookiesService.checkAuthToken(req);
  }
}
