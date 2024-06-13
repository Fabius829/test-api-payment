import { IsNotEmpty, IsPositive } from 'class-validator';

export class ReplenishmentInputModel {
  @IsNotEmpty()
  @IsPositive()
  sum: number;
}

export class BuyInputModel {
  @IsNotEmpty()
  @IsPositive()
  cost: number;
}
