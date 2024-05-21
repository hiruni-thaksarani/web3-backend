import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import userTypes from '../constants/user_types';
import statuses from '../constants/statuses';
import UserModule  from '../user/use.modules';


@Schema({ _id: false })

//Basic Info
export class basic_info {
  @Prop({
    required: true,
    trim: true,
  })
  first_name: string;

  @Prop({
    required: true,
    trim: true,
  })
  last_name: string;

  @Prop({
    trim: true,
  })
  dob: Date;

  @Prop({
    required: true,
    trim: true,
    enum: ['MALE', 'FEMALE'],
  })
  gender: string;
}

// Contact Info
@Schema({ _id: false })
export class contact_info {
  @Prop({
    required: true,
    trim: true,
  })
  mobile_numbers: string[]; 

  @Prop({
    required: true,
    trim: true,
    unique: true
  })
  email: string;
}


//Auth Info
@Schema()
export class auth_info {
  @Prop({
    trim: true,
  })
  password: string;
}

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({
    trim: true,
    enum: [userTypes.admin, userTypes.user],
  })
  type: string;

  @Prop({
    trim: true,
    enum: [statuses.active, statuses.inactive, statuses.onboard],
    default: statuses.onboard,
  })
  status: string;

  @Prop({
  })
  fcmToken: string;

  @Prop({
    required: true,
  })
  basic_info: basic_info;

  @Prop({
    required: true,
  })
  contact_info: contact_info;

  @Prop()
  auth_info: auth_info;

}
export const UserSchema = SchemaFactory.createForClass(User);


