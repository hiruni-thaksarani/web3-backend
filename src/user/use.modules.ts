// user/user.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import UserController from './user.controller';
import UserService from './user.service';
import { User, UserSchema } from './user.schema';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { FirebaseModule } from 'src/firebase.module';
import { NotificationModule } from 'src/notifications/notification.module';


@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "jwt" }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ConfigModule.forRoot(),
    FirebaseModule,
    NotificationModule,
  ],
  controllers: [UserController],
  providers: [UserService], 
  exports: [UserService], 
})
export default class UserModule {};
