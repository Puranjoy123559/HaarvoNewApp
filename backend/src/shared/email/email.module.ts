import { Module } from '@nestjs/common';
import { EmailService } from './email.service';

// We export EmailService so any module that imports EmailModule can inject it.
@Module({
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
