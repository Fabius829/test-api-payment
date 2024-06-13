import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentHistory } from '../entities/history';
import { Repository } from 'typeorm';
import { User } from '../entities/user';

@Injectable()
export class PaymentRepository {
  constructor(
    @InjectRepository(PaymentHistory)
    protected paymentRepository: Repository<PaymentHistory>,
    @InjectRepository(User)
    protected userRepository: Repository<User>,
  ) {}

  async createPaymentHistory(newPaymentHistory: PaymentHistory): Promise<void> {
    await this.paymentRepository.save(newPaymentHistory);
  }
  async increaseUserBalance(id: string, sum: number): Promise<boolean | null> {
    const user = await this.userRepository
      .createQueryBuilder('u')
      .where('u.id =:id', { id })
      .getOne();

    if (!user) {
      return false;
    }

    const newBalance = user.balance + sum;

    const increasedBalance = await this.userRepository.update(
      { id: id },
      { balance: newBalance },
    );

    return (
      increasedBalance.affected !== null &&
      increasedBalance.affected !== undefined &&
      increasedBalance.affected > 0
    );
  }

  async decreaseUserBalance(id: string, sum: number): Promise<boolean | null> {
    const user = await this.userRepository
      .createQueryBuilder('u')
      .where('u.id =:id', { id })
      .getOne();

    if (!user) {
      return false;
    }

    const newBalance = user.balance - sum;

    const increasedBalance = await this.userRepository.update(
      { id: id },
      { balance: newBalance },
    );

    return (
      increasedBalance.affected !== null &&
      increasedBalance.affected !== undefined &&
      increasedBalance.affected > 0
    );
  }
}
