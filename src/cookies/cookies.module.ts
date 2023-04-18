import { Module } from '@nestjs/common';
import { CookiesService } from './cookies.service';
import { CookiesController } from './cookies.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [],
  providers: [CookiesService, JwtService],
  controllers: [CookiesController],
})
export class CookiesModule {}
