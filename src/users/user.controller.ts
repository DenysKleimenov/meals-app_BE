import {
  Controller,
  Get,
  Param,
  NotFoundException,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/guards/roles.guard';
import { UsersService } from './users.service';

const normalize = ({ id, username, email }) => ({ id, username, email });

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get()
  async getAll() {
    return this.usersService.findAll();
  }

  @Get('findbyemail/:email')
  async getUserByEmail(@Param('email') email: string) {
    const foundUser = await this.usersService.findOneByEmail(email);

    return normalize(foundUser);
  }

  @Get(':id')
  async getUserById(@Param('id') id: number) {
    const foundUser = await this.usersService.findOneById(id);

    if (!foundUser) {
      throw new NotFoundException('Could not find user');
    }

    return foundUser;
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  deleteUser(@Param('id') id: number) {
    return this.usersService.deleteUser(id);
  }
}
