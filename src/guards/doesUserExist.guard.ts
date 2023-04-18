import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class DoesUserExist implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    return this.validateRequest(request);
  }

  async validateRequest(@Req() request: Request) {
    if (request.body.email) {
      const emailExist = await this.usersService.findOneByEmail(
        request.body.email,
      );

      if (emailExist) {
        throw new ForbiddenException('Account with this email already exists');
      }
    }

    return true;
  }
}
