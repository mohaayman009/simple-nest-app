import { Module } from '@nestjs/common';
import { NotificationsController } from './notification.controller';
import { NotificationService } from './notification.service';
import { FirebaseService } from './firebase.service';
@Module({
  controllers: [NotificationsController],
  providers: [NotificationService, FirebaseService],
})
export class NotificationModule {}
