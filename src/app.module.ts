import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerModule } from '@nestjs/throttler';

import { CqrsModule } from '@nestjs/cqrs';

import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './Test/entities/user';
import { PaymentHistory } from './Test/entities/history';
import { UserController } from './Test/controllers/user.controller';
import { CreateUserUserCase } from './Test/use-cases/createUser.use-case';
import { UserRepository } from './Test/repositories/user.repository';
import { DeleteUserUseCase } from './Test/use-cases/deleteUser.use-case';
import { PaymentController } from './Test/controllers/payment.controller';
import { IncreaseUserBalanceUseCase } from './Test/use-cases/increaseUser-balance.use-case';
import { PaymentRepository } from './Test/repositories/payment.repository';
import { BuySomethingCase } from './Test/use-cases/buySomething.use-case';
import { TestingController } from './drop-dataBase/drop-dataBase.controller';
import { DropDataBaseService } from './drop-dataBase/drop.dataBase.service';
import { jwtConstants } from './aplication/setting';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      // entities: [UserTrm, UsersSessionTrm],
      // host: 'localhost',
      // port: 5432,
      // username: 'i_node_js',
      // password: 'sa',
      // database: 'MyNestProject',
      autoLoadEntities: true,
      synchronize: true,
      logging: false,
      url: process.env.NEON_URL,
      ssl: true,
    }),
    TypeOrmModule.forFeature([User, PaymentHistory]),
    CqrsModule,
    ConfigModule.forRoot(),
    ThrottlerModule.forRoot([
      {
        ttl: 10000,
        limit: 5,
      },
    ]),
    PassportModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
    }),
  ],
  controllers: [UserController, PaymentController, TestingController],
  providers: [
    CreateUserUserCase,
    UserRepository,
    DeleteUserUseCase,
    IncreaseUserBalanceUseCase,
    PaymentRepository,
    BuySomethingCase,
    DropDataBaseService,
  ],
})
export class AppModule {}
