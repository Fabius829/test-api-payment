import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class DropDataBaseService {
  constructor(
    @InjectDataSource()
    protected dataSource: DataSource,
  ) {}
  async deleteAllData() {
    await this.dataSource.query(`DELETE FROM public."user"`);
    await this.dataSource.query(`DELETE FROM public."payment_history"`);
    console.log('Base drop');
  }
}
