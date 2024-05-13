import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Document } from 'mongoose';
import CreateUserDto from './dto/createUser.dto';
import GetUsersDto from './dto/getUsers.dto';
import { User, UserDocument } from './user.schema';
import UserLoginDto from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';


@Injectable()
export default class UserService {
  updatedUser(invalidUserDto: { basic_info: { first_name: string; last_name: string; dob: Date; gender: string; }; type: string; status: string; contact_info: { mobile_numbers: string[]; email: string; }; auth_info: { password: string; }; }): any {
      throw new Error("Method not implemented.");
  }
  
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private readonly mailService: MailerService,
    
  ) {}

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }
  
  async findAllUsers(): Promise<User[]> {
    return this.userModel.find().exec();
  }
  
  async createUser(createUserDto: CreateUserDto) {
    const {auth_info}=createUserDto;
    const{contact_info}=createUserDto;
    const hashedPassword = await bcrypt.hash(auth_info.password,10);
    const sEmail =contact_info.email.trim().toLowerCase();
    const sMobile = contact_info.mobile_numbers;

    const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(sEmail)) {
      throw new ConflictException('Invalid email format');
    }

    const isEmailExist =  await this.userModel.findOne({ "contact_info.email": sEmail }).exec();    

    if(isEmailExist){
      throw new ConflictException("Email already exist");
    }
    
    const isExistingMobile = await this.userModel.findOne({ "contact_info.mobile_numbers": sMobile }).exec();

    if(isExistingMobile){
      throw new ConflictException("Mobile number already exist.")
    }

    const uniqueMobileNumbers = new Set(sMobile);
    if (uniqueMobileNumbers.size !== sMobile.length) {
        throw new ConflictException("Duplicate mobile numbers are not allowed.");
    }

    if(createUserDto.contact_info.mobile_numbers.length>3){
      throw new ConflictException("Maximum 3 numbers can enter.")
    }

    if(createUserDto.basic_info.first_name.length>25 || createUserDto.basic_info.last_name.length>25){
      throw new ConflictException("Maximum length for name is 25.")
    }

    for (const mobile of sMobile) {
      if (mobile.length > 15) {
          throw new ConflictException("Maximum length for a mobile number is 15.");
     
    }}

    if(createUserDto.contact_info.email.length>320){
      throw new ConflictException("Maximum length for email is 25.")
    }

    createUserDto.auth_info.password=hashedPassword;
    const user = await this.userModel.create(createUserDto);
    // console.log(user);
    return createUserDto;
  }

  async login(userLoginDto: UserLoginDto): Promise<{ access_token: string }> {
    const { email, password } = userLoginDto;
    const user = await this.userModel.findOne({ "contact_info.email": email });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.auth_info.password) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordMatched = bcrypt.compareSync(password, user.auth_info.password);
    
    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = { type: user.type, email: user.contact_info.email };
    const access_token = this.jwtService.sign(payload);
    return { access_token};
  }

  async deleteUserByEmail(email: string): Promise<void> {
    const deletedUser = await this.userModel.findOneAndDelete({ "contact_info.email": email }).exec();
    if (!deletedUser) {
      throw new NotFoundException('User not found');
    }
  }

  async updateUserByEmail(email: string, updateUserDto: Partial<CreateUserDto>): Promise<User> {

    const userToUpdate = await this.userModel.findOne({ 'contact_info.email': email }).exec();

    
    console.log("My email"+email);

    const isUser = await this.userModel.findOne({'contact_info.email':updateUserDto.contact_info.email}).exec();

    if(isUser){
      const isExistEmail = await this.userModel.findOne({'contact_info.email':email,_id:{$ne:isUser._id}}).exec();

      if(isExistEmail){
        throw new ConflictException('Existing email');
      }

      for (const mobileNumber of updateUserDto.contact_info.mobile_numbers) {
        const isExistMobile = await this.userModel.findOne({'contact_info.mobile_numbers': mobileNumber, _id: {$ne: isUser._id}}).exec();
        if (isExistMobile) {
          throw new ConflictException("Mobile number already exist.");
        }
      }


  //   // If contact_info is present in updateUserDto, update the email
  //   if (updateUserDto.contact_info && updateUserDto.contact_info.email) {
  //     // Check if the updated email already exists for another user
  //     const userWithUpdatedEmail = await this.userModel.findOne({
  //         'contact_info.email': updateUserDto.contact_info.email,
  //         _id: { $ne: userToUpdate._id } // Exclude the current user
  //     }).exec();

  //     if (userWithUpdatedEmail) {
  //         throw new ConflictException('Email already exists for another user');
  //     }

  //     // Update the email
  //     userToUpdate.contact_info.email = updateUserDto.contact_info.email;
  // }

  // If contact_info is present in updateUserDto, update the mobile numbers
  if (updateUserDto.contact_info && updateUserDto.contact_info.mobile_numbers) {
      const newMobileNumbers = updateUserDto.contact_info.mobile_numbers;

      // Check if any of the new mobile numbers already exist for other users
      for (const newMobileNumber of newMobileNumbers) {
          const userWithMobileNumber = await this.userModel.findOne({
              'contact_info.mobile_numbers': newMobileNumber,
              _id: { $ne: userToUpdate._id } // Exclude the current user
          }).exec();

          if (userWithMobileNumber) {
              throw new ConflictException("Mobile number already exists for another user");
          }
      }

      for (const newMobileNumber of newMobileNumbers) {
        if (newMobileNumber.length > 15) {
            throw new ConflictException("Maximum length for a mobile number is 15.");
        }
    }

      // Check if any new mobile numbers are duplicates
      const uniqueMobileNumbers = new Set(newMobileNumbers);
      if (uniqueMobileNumbers.size !== newMobileNumbers.length) {
          throw new ConflictException("Duplicate mobile numbers are not allowed.");
      }

      // Update the mobile numbers
      userToUpdate.contact_info.mobile_numbers = newMobileNumbers;
  }


    }

    // Validate mobile numbers count and uniqueness
  if (updateUserDto.contact_info.mobile_numbers.length > 3) {
    throw new ConflictException("Maximum 3 numbers can be entered.");
  }

     // Validate first name and last name lengths
    if (updateUserDto.basic_info && (updateUserDto.basic_info.first_name.length > 25 )) {
      throw new ConflictException("Maximum length for first name is 25.");
    }

    if (updateUserDto.basic_info && (updateUserDto.basic_info.last_name.length > 25)) {
      throw new ConflictException("Maximum length for last name is 25.");
    }

    if (updateUserDto.basic_info && (updateUserDto.contact_info.email.length > 320)) {
      throw new ConflictException("Maximum length for email is 320.");
    }

    if (updateUserDto.basic_info && (updateUserDto.contact_info.mobile_numbers.length > 15)) {
      throw new ConflictException("Maximum length for mobile number is 15.");
    }

    // Validate mobile numbers count
    if (updateUserDto.contact_info && updateUserDto.contact_info.mobile_numbers.length > 3) {
      throw new ConflictException("Maximum 3 numbers can be entered.");
    }

    // Validate email format
    if (updateUserDto.contact_info && !this.isValidEmail(updateUserDto.contact_info.email)) {
      throw new ConflictException('Invalid email format');
    }

    

    // if (updateUserDto.contact_info && updateUserDto.contact_info.mobile_numbers) {
    //   const updatedMobileNumbers = updateUserDto.contact_info.mobile_numbers;
    //   for (const updatedMobileNumber of updatedMobileNumbers) {
    //     const existingUserWithMobileNumber = await this.userModel.findOne({ 'contact_info.mobile_numbers': updatedMobileNumber }).exec();
    //     if (existingUserWithMobileNumber && existingUserWithMobileNumber.contact_info.email !== email) {
    //       throw new ConflictException('Mobile number  already exists for another user');
    //     }
    //   }
    // }

    // if (updateUserDto.contact_info && updateUserDto.contact_info.mobile_numbers) {
    //   if (updateUserDto.contact_info.mobile_numbers.length > 3) {
    //     throw new ConflictException("Maximum 3 numbers can be entered.");
    //   }

    //   for (const mobileNumber of updateUserDto.contact_info.mobile_numbers) {
    //     const isExistMobile = await this.userModel.findOne({'contact_info.mobile_numbers': mobileNumber, _id: {$ne: isUser._id}}).exec();
    //     if (isExistMobile) {
    //       throw new ConflictException(`Mobile number ${mobileNumber} already exists`);
    //     }
    //   }
    // }


    const user = await this.userModel.findOneAndUpdate({ 'contact_info.email': email }, updateUserDto,{new :true}).exec();
    console.log(user);

    if (!user) {
      throw new NotFoundException('User not found');
    }


    // if(updateUserDto.contact_info.email)

    // Check if the email already exists
    // const existingUser = await this.userModel.findOne({ "contact_info.email": email }).exec();
    // if (!existingUser) {
    //   throw new NotFoundException('User not found');
    // }

    return user;
  }

  async deactivateUser(email: string): Promise<User> {
    const user = await this.userModel.findOne({ 'contact_info.email': email }).exec();
    console.log(user);
    
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    // Check if the user is already inactive
    if (user.status === 'INACTIVE') {
      throw new ConflictException('User is already inactive');
    }
  
    // Update user status to 'INACTIVE'
    const updatedUser = await this.userModel.findOneAndUpdate(
      { 'contact_info.email': email },
      { status: 'INACTIVE' },
      { new: true }
    ).exec();

    const mail = await this.mailService.sendMail({
      to: updatedUser.contact_info.email,
      subject: 'Test Mail',
      template: 'test',
      context: {
          firstname: updatedUser.basic_info.first_name,
      }
  })
  
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
  
    // Send deactivation email
    // await this.sendDeactivationEmail(updatedUser);
    
    return updatedUser;
  }
  

  async findUserByEmail(email: string): Promise<User | null> {
    try {
      const user = await this.userModel.findOne({ "contact_info.email": email }).exec();
      return user;
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }

  
  // async sendDeactivationEmail(user: User): Promise<void> {
  //   try {
  //     await this.mailService.sendMail({
  //       to: user.contact_info.email,
  //       subject: 'Your Profile Deactivation',
  //       template:'test',
  //       context: {
  //        firstname:user.basic_info.first_name,
  //       },
  //     });
  //     console.log("Deactivation email sent successfully!");
  //   } catch (error) {
  //     console.error("Error sending deactivation email:", error);
  //   }
  // }




  //  // Function to send deactivation email
  //  async sendDeactivationEmail(user: User): Promise<void> {
  //   try {
  //     // Create a transporter using SMTP transport
  //     const transporter = nodemailer.createTransport({
  //       service: "gmail",
  //       auth: {
  //         user: "your_email@gmail.com",
  //         pass: "your_password",
  //       },
  //     });

  //     // Construct email message
  //     const mailOptions = {
  //       from: "your_email@gmail.com",
  //       to: user.contact_info.email,
  //       subject: "Your Profile Deactivation",
  //       text: `Dear ${user.basic_info.first_name},\n\nYour profile has been deactivated by the Admin.\nKindly reach us at +94772958078 for inquiries.\n\nThanks,\nTeam W3G`,
  //     };

  //     // Send the email
  //     await transporter.sendMail(mailOptions);
  //     console.log("Deactivation email sent successfully!");
  //   } catch (error) {
  //     console.error("Error sending deactivation email:", error);
  //   }
  // }

  

  // async sendMail() {
  //   const message = `Forgot your password? If you didn't forget your password, please ignore this email!`;

  //   this.mailService.sendMail({
  //     from: 'hthaksarani@gmail.com',
  //     to: 'hthaksarani@gmail.com',
  //     subject: `How to Send Emails with Nodemailer`,
  //     text: message,
  //   });
  // }

  
  
}
