import { Body, Controller, Post } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { User } from 'src/user/user.schema';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}
  @Post('send')
  async receiveFcmToken(
    @Body('userId') userId: string,
    @Body('token') token: string,
  ) {
    console.log('Received FCM token:', token);
    console.log(userId);
    await this.notificationService.saveUserToken(userId, token);
    // Send a notification to the user
    await this.notificationService.sendNotification(userId, {
      title: 'Warning',
      body: 'Your account has been deactivated...', 
    });
  }

}