import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserDto } from 'src/dto/user.dto';
import { User } from './user.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  createUser(user: UserDto) {
    return this.userModel.create({ ...user });
  }

  findAll() {
    return this.userModel.findAll();
  }

  findOneByToken(activationToken: string) {
    return this.userModel.findOne({ where: { activationToken } });
  }

  findOneByEmail(email: string) {
    return this.userModel.findOne({ where: { email } });
  }

  findOneById(id: number) {
    return this.userModel.findByPk(id);
  }
}
