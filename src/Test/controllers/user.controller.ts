import { CommandBus } from '@nestjs/cqrs';
import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Param,
  Post,
} from '@nestjs/common';
import { UserInputModel } from '../validations/user.validation';
import { User } from '../entities/user';
import { CreateUserCommand } from '../use-cases/createUser.use-case';
import { DeleteUserCommand } from '../use-cases/deleteUser.use-case';

@Controller('users')
export class UserController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('create-user')
  @HttpCode(201)
  async createUser(@Body() userDto: UserInputModel): Promise<User> {
    return await this.commandBus.execute(new CreateUserCommand(userDto));
  }

  @Delete('delete-user/:id')
  @HttpCode(204)
  async deleteUser(@Param('id') id: string): Promise<void> {
    return await this.commandBus.execute(new DeleteUserCommand(id));
  }
}
