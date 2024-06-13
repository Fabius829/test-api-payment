import { BuyInputModel } from '../validations/user.validation';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PaymentRepository } from '../repositories/payment.repository';
import { UserRepository } from '../repositories/user.repository';
import { PaymentHistory } from '../entities/history';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

export class BuySomethingCommand {
  constructor(
    public id: string,
    public costDto: BuyInputModel,
  ) {}
}

@CommandHandler(BuySomethingCommand)
export class BuySomethingCase implements ICommandHandler<BuySomethingCommand> {
  constructor(
    protected paymentRepository: PaymentRepository,
    protected userRepository: UserRepository,
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async execute(command: BuySomethingCommand): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.paymentRepository.decreaseUserBalance(
        command.id,
        command.costDto.cost,
      );

      const dateNow = new Date().getTime().toString();

      const newPaymentHistory = new PaymentHistory();
      newPaymentHistory.id = dateNow;
      newPaymentHistory.userId = command.id;
      newPaymentHistory.action = 'spent';
      newPaymentHistory.amount = -command.costDto.cost;
      newPaymentHistory.timestamp = new Date();

      await this.paymentRepository.createPaymentHistory(newPaymentHistory);
      await queryRunner.commitTransaction();
    } catch {
      await queryRunner.rollbackTransaction();
      throw new Error('The transaction has not been completed');
    }
  }
}
