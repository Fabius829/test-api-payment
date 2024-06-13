import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';

export class DeleteUserCommand {
  constructor(public id: string) {}
}
@CommandHandler(DeleteUserCommand)
export class DeleteUserUseCase implements ICommandHandler<DeleteUserCommand> {
  constructor(protected userRepository: UserRepository) {}

  async execute(command: DeleteUserCommand): Promise<void> {
    const userDeleted = await this.userRepository.deleteUser(command.id);
    if (!userDeleted) {
      throw new NotFoundException([
        {
          message: 'User not found',
        },
      ]);
    }
    return;
  }
}
