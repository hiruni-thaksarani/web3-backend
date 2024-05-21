import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as admin from 'firebase-admin';
import { Model } from 'mongoose';
import { User } from 'src/user/user.schema';

@Injectable()
export class NotificationService {
  constructor(
    @Inject('FIREBASE_ADMIN') private readonly firebase: admin.app.App,
    @InjectModel(User.name) private  userModel: Model<User>,
  ) {}
  async saveUserToken(userId: string, token: string) {
    await this.userModel.findByIdAndUpdate(userId, { 'contact_info.fcmToken': token });
  }
  async sendNotification(userId: string, payload: { title: string; body: string }) {
    const user = await this.userModel.findById(userId);
    if (user && user.fcmToken) {
      const message = {
        notification: {
          title: payload.title,
          body: payload.body,
        },
        token: user.fcmToken,
      };
      console.log("message--",message)
      this.firebase.messaging().send(message)
        .then((response) => {
          console.log(`Successfully sent notification.......: ${response}`);
        })
        .catch((error) => {
          console.error(`Error sending notification: ${error}`);
        });
    } else {
      console.error(`User or FCM token not found for userId: ${userId}`);
    }
  }

}


