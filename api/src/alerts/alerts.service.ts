import { Injectable } from '@nestjs/common';
import { CreateAlertDto } from './dto/create-alert.dto';

@Injectable()
export class AlertsService {
  create(createAlertDto: CreateAlertDto) {
    return 'This action adds a new alert';
  }

  findAll() {
    return `This action returns all alerts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} alert`;
  }
}
