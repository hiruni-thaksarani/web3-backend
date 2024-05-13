import { Body, Controller, Delete, ExecutionContext, Get, Injectable, Param, Patch, Post, Res, UseGuards } from '@nestjs/common';
import { Response, response } from 'express';
import UserService from './user.service';
import UserLoginDto from './dto/login.dto';
import CreateUserDto from './dto/createUser.dto';
import { User } from './user.schema';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from './guards/admin.guards';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
}

@Controller("users")
export default class UserController {
  [x: string]: any;
  constructor(private readonly service: UserService) {}

  @Post("sign-up")
  async createUser(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    try {
      const result = await this.service.createUser(createUserDto);
      // return result;
      res.status(201).send(result);
    } catch (error) {
      res.status(409).send(error);
    }
  }

  
  @Get("getUsers")
  async getAllUsers(): Promise<User[]> {
    try {
      const users = await this.service.findAllUsers();
      return users;
    } catch (error) {
      console.error('Error occurred while fetching users:', error);
      throw error;
    }
  }
  
  @Post("login")
  async login(@Body() userLoginDto: UserLoginDto, @Res() res: Response): Promise<void> {
    try {
      const { access_token } = await this.service.login(userLoginDto);
      console.log("Access token",access_token)
      res.set({authorization:access_token}).json(); 
    } catch (error) {
      console.error('Error occurred during login:', error);
      res.status(401).send('Invalid email or password');
    }
  }

  @Delete(":email")
  async deleteUserByEmail(@Param('email') email: string, @Res() res: Response): Promise<void> {
  try {
    await this.service.deleteUserByEmail(email);
    res.status(200).send('User deleted successfully');
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).send('Internal server error');
  }
  }

  @Patch(':email')
  async updateUser(@Param('email') email: string, @Body() updateUserDto: Partial<CreateUserDto>, @Res() res: Response): Promise<void> {
    try {
      const updatedUser = await this.service.updateUserByEmail(email.trim(), updateUserDto);
      res.status(200).json(updatedUser);
    } catch (error) {
      // console.error('Error updating user:', error);
      res.status(400).send({error});
    }
  }

  @Patch('deactivate/:email')
  async deactivateUser(@Param('email') email: string, @Res() res: Response): Promise<void> {
    try {

      const updatedUser = await this.service.deactivateUser(email);
      // await this.service.sendDeactivationEmail(updatedUser); 
      console.log(updatedUser);
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(400).send({error});
    }
  }

  // @Get(":email")
  // async getUserByEmail(@Param('email') email: string, @Res() res: Response): Promise<void> {
  //   try {
  //     const user = await this.service.findUserByEmail(email);
  //     if (!user) {
  //       res.status(404).send('User not found');
  //     } else {
  //       res.status(200).json(user);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching user by email:', error);
  //     res.status(500).send('Internal server error');
  //   }
  // }
  

  // @Get()
  // sendMailer(@Res() response: any) {
  //   const mail = this.appService.sendMail();

  //   return response.status(200).json({
  //     message: 'success',
  //     mail,
  //   });
  // }



  // @Get('sendEmail')
  // sendMailer(@Res() response: any) {
  //   const mail = this.UserService.sendMail();

  //   return response.status(200).json({
  //     message: 'success',
  //     mail,
  //   });
  // }

  
  // @Get("logout")
  // async logout(@Res() res: Response): Promise<void> {
  //   try {
  //     // Any additional cleanup operations can be performed here
      
  //     // Respond with success message
  //     res.status(200).send('Logout successful');
  //   } catch (error) {
  //     console.error('Error occurred during logout:', error);
  //     res.status(500).send('Internal server error');
  //   }
}



