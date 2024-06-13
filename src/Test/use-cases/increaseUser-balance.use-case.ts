import { ReplenishmentInputModel } from '../validations/user.validation';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PaymentRepository } from '../repositories/payment.repository';
import { NotFoundException } from '@nestjs/common';
import { PaymentHistory } from '../entities/history';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

export class IncreaseUserBalanceCommand {
  constructor(
    public id: string,
    public replenishmentDto: ReplenishmentInputModel,
  ) {}
}

@CommandHandler(IncreaseUserBalanceCommand)
export class IncreaseUserBalanceUseCase
  implements ICommandHandler<IncreaseUserBalanceCommand>
{
  constructor(
    protected paymentRepository: PaymentRepository,
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async execute(command: IncreaseUserBalanceCommand): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const updatedUser = await this.paymentRepository.increaseUserBalance(
        command.id,
        command.replenishmentDto.sum,
      );
      if (!updatedUser) {
        throw new NotFoundException([
          {
            message: 'User not found',
          },
        ]);
      }
      const dateNow = new Date().getTime().toString();

      const newPaymentHistory = new PaymentHistory();
      newPaymentHistory.id = dateNow;
      newPaymentHistory.userId = command.id;
      newPaymentHistory.action = 'replenishment';
      newPaymentHistory.amount = command.replenishmentDto.sum;
      newPaymentHistory.timestamp = new Date();

      await this.paymentRepository.createPaymentHistory(newPaymentHistory);
      await queryRunner.commitTransaction();
    } catch {
      await queryRunner.rollbackTransaction();
      throw new Error('The transaction has not been completed');
    }
  }
}
