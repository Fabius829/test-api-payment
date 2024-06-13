import { Body, Controller, HttpCode, Param, Post, Put } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {} from '../validations/user.validation';
import { IncreaseUserBalanceCommand } from '../use-cases/increaseUser-balance.use-case';
import { BuySomethingCommand } from '../use-cases/buySomething.use-case';
import {
  BuyInputModel,
  ReplenishmentInputModel,
} from '../validations/payment.validation';

@Controller('payment')
export class PaymentController {
  constructor(private readonly commandBus: CommandBus) {}

  @Put('replenishment/:id')
  @HttpCode(204)
  async increaseBalance(
    @Param('id') id: string,
    @Body() replenishmentDto: ReplenishmentInputModel,
  ): Promise<void> {
    return await this.commandBus.execute(
      new IncreaseUserBalanceCommand(id, replenishmentDto),
    );
  }
  @Post('buy/:id')
  @HttpCode(201)
  async buySomething(
    @Param('id') id: string,
    @Body() costDto: BuyInputModel,
  ): Promise<void> {
    return await this.commandBus.execute(new BuySomethingCommand(id, costDto));
  }
}
