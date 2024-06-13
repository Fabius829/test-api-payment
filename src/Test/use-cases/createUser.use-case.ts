import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { User } from '../entities/user';
import { UserInputModel } from '../validations/user.validation';
import { UserRepository } from '../repositories/user.repository';

export class CreateUserCommand {
  constructor(public userDto: UserInputModel) {}
}
@CommandHandler(CreateUserCommand)
export class CreateUserUserCase implements ICommandHandler<CreateUserCommand> {
  constructor(protected userRepository: UserRepository) {}

  async execute(command: CreateUserCommand): Promise<User> {
    const newUser = new User();
    newUser.id = '1';
    newUser.balance = command.userDto.balance;

    return await this.userRepository.createUser(newUser);
  }
}
