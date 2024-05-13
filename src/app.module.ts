import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { mongooseModuleAsyncOptions } from './config/mongoose.config';
import UserModule from './user/use.modules'; // corrected import
import { JwtModule } from '@nestjs/jwt';
import { jwtModuleAsyncOptions } from './config/jwt.config';
import { User, UserSchema } from './user/user.schema';
import { MailerModule } from '@nestjs-modules/mailer';
import UserController from './user/user.controller';
import UserService from './user/user.service';
import { mailerConfig } from './config/mail.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync(mongooseModuleAsyncOptions),
    JwtModule.registerAsync(jwtModuleAsyncOptions),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    UserModule,
    MailerModule.forRootAsync(mailerConfig),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class AppModule {}