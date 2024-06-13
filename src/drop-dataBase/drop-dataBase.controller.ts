import { Controller, Delete, HttpCode, Res } from '@nestjs/common';
import { DropDataBaseService } from './drop.dataBase.service';

@Controller('drop-dataBase')
export class TestingController {
  constructor(private myService: DropDataBaseService) {}

  @Delete('/all-data')
  @HttpCode(204)
  async deleteAllData(@Res({ passthrough: true }) res: Response) {
    await this.myService.deleteAllData();
    return;
  }
}
