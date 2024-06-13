import { IsNotEmpty } from 'class-validator';

export class UserInputModel {
  @IsNotEmpty()
  balance: number;
}
