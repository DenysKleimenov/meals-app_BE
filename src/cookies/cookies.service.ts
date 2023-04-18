import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class CookiesService {
  constructor(private readonly jwtService: JwtService) {}

  checkAuthToken(req: Request): boolean {
    const token = req.cookies.token;
    const user = this.jwtService.decode(token);

    console.log(user);

    if (user) {
      const jwtExpiration = user['exp'] * 1000;
      const currentDateInMilliseconds = new Date().getTime();

      return currentDateInMilliseconds < jwtExpiration;
    }

    return false;
  }
}
