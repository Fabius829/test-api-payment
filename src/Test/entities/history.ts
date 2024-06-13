import { Column, Entity, PrimaryColumn } from 'typeorm';
import { IsIn } from 'class-validator';

@Entity()
export class PaymentHistory {
  @PrimaryColumn()
  id: string;
  @Column()
  userId: string;
  @Column()
  @IsIn(['replenishment', 'spent'])
  action: string;
  @Column()
  amount: number;
  @Column()
  timestamp: Date;
}
