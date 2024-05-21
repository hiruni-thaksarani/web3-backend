// import { getModelToken } from '@nestjs/mongoose';
// import { Test, TestingModule } from '@nestjs/testing';
// import UserService from './user.service';
// import { User, contact_info } from './user.schema';
// import {
//   ConflictException,
//   NotFoundException,
//   UnauthorizedException,
// } from '@nestjs/common';
// import * as bcrypt from 'bcrypt';
// import { JwtService } from '@nestjs/jwt';
// import { ConfigService } from '@nestjs/config';
// import { MailerService } from '@nestjs-modules/mailer';
// import { mock } from 'node:test';
// import UserLoginDto from './dto/login.dto';

// describe('UserService', () => {
//   let userService: UserService;
//   let mockUserModel: any;
//   let mockJwtService: JwtService;
//   let mockConfigService: ConfigService;
//   let mockMailerService: MailerService;

//   const mockUserDto = {
//     type: 'ADMIN',
//     status: 'ACTIVE',
//     basic_info: {
//       first_name: 'Johnnn',
//       last_name: 'Doe',
//       dob: new Date('1995-04-23'),
//       gender: 'MALE',
//     },
//     contact_info: {
//       mobile_numbers: ['323454'],
//       email: 'adede@gmail.com',
//     },
//     auth_info: {
//       password: '12345',
//     },
//   };

//   beforeEach(async () => {
//     mockUserModel = {
//       findOne: jest.fn(),
//       create: jest.fn(),
//       findOneAndUpdate: jest.fn(),
//       findOneAndDelete: jest.fn(),
//     };

//     mockUserModel.findOne.mockReturnValue({
//       exec: jest.fn().mockResolvedValueOnce(null), // Assuming 'user' is defined in your test
//     } as any);

//     mockJwtService = {
//       signAsync: jest.fn().mockResolvedValue('mocked_access_token'),
//     } as unknown as JwtService; // Initialize mockJwtService with proper properties

//     mockConfigService = {
//       get: jest.fn(),
//     } as unknown as ConfigService;

//     mockMailerService = {
//       sendMail: jest.fn(),
//     } as unknown as MailerService;

//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         UserService,
//         {
//           provide: getModelToken(User.name),
//           useValue: mockUserModel,
//         },
//         {
//           provide: JwtService,
//           useValue: mockJwtService,
//         },
//         {
//           provide: ConfigService,
//           useValue: mockConfigService,
//         },
//         {
//           provide: MailerService,
//           useValue: mockMailerService,
//         },
//       ],
//     }).compile();

//     userService = module.get<UserService>(UserService);
//   });

//   afterEach(() => {
//     jest.resetAllMocks();
//   });

//   describe('login', () => {

//     it('should return access_token and user for valid credentials', async () => {

//         const userLoginDto: UserLoginDto = {
//           email: 'abc@gmail.com',
//           password: '12345',
//         };

//         const result = await userService.login(userLoginDto);
  
//         expect(result).toHaveProperty('access_token');
//         // expect(result).toHaveProperty('user');
//       });

//     it('should throw UnauthorizedException for invalid credentials', async () => {
//         jest.spyOn(mockUserModel, 'findOne').mockReturnValueOnce({
//           exec: jest.fn().mockResolvedValueOnce(null), // User not found
//         } as any);
      
//         await expect(
//           userService.login({
//             email: 'adede@gmail.com',
//             password: '12345',
//           }),
//         ).rejects.toThrowError(UnauthorizedException);
//       });
      

//     it('should throw UnauthorizedException for invalid credentials', async () => {
//       jest.spyOn(mockUserModel, 'findOne').mockReturnValueOnce({
//         exec: jest.fn().mockResolvedValueOnce(null), // User not found
//       } as any);

//       await expect(
//         userService.login({
//           email: 'au676@gmail.com',
//           password: '12345',
//         }),
//       ).rejects.toThrowError(UnauthorizedException);
//     });
//   });

//   describe('userCreate', () => {
//     it('should create a new user with valid data', async () => {
//       // Mock hashed password
//       const hashedPassword = await bcrypt.hash(
//         mockUserDto.auth_info.password,
//         10,
//       );
//       // Create createUserDto with hashed password
//       const createUserDto = {
//         ...mockUserDto,
//         auth_info: { password: hashedPassword },
//       };

//       jest.spyOn(mockUserModel, 'findOne').mockReturnValueOnce({
//         exec: jest.fn().mockResolvedValueOnce(null),
//       });

//       const result = await userService.createUser(createUserDto);

//       expect(mockUserModel.findOne).toHaveBeenCalledTimes(2); // Ensure findOne is called twice
//       expect(result).toEqual(createUserDto); // Expect the result to match createUserDto
//     });

//     it('should throw ConflictException for already existing email', async () => {
//       jest.spyOn(mockUserModel, 'findOne').mockReturnValueOnce({
//         exec: jest.fn().mockResolvedValueOnce(User),
//       });

//       await expect(userService.createUser(mockUserDto)).rejects.toThrowError(
//         ConflictException,
//       );
//     });

//     it('should throw ConflictException for already existing mobile number', async () => {
//       jest.spyOn(mockUserModel, 'findOne').mockReturnValueOnce({
//         exec: jest.fn().mockResolvedValueOnce(User),
//       });

//       await expect(userService.createUser(mockUserDto)).rejects.toThrowError(
//         ConflictException,
//       );
//     });

//     it('should throw ConflictException if more than 3 mobile numbers are provided', async () => {
//       const createUserDto = {
//         ...mockUserDto,
//         contact_info: {
//           ...mockUserDto.contact_info,
//           mobile_numbers: [
//             '1234567890',
//             '2345678901',
//             '3456789012',
//             '4567890123',
//           ],
//         },
//       };

//       await expect(userService.createUser(createUserDto)).rejects.toThrowError(
//         ConflictException,
//       );
//     });

//     it('should throw ConflictException for invalid length of first name', async () => {
//       const invalidUserDto = {
//         ...mockUserDto,
//         basic_info: {
//           ...mockUserDto.basic_info,
//           first_name: 'JohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohn',
//         },
//       };

//       await expect(userService.createUser(invalidUserDto)).rejects.toThrowError(
//         ConflictException,
//       );
//     });

//     it('should throw ConflictException for invalid length of last name', async () => {
//       const invalidUserDto = {
//         ...mockUserDto,
//         basic_info: {
//           ...mockUserDto.basic_info,
//           last_name: 'DoeDoeDoeDoeDoeDoeDoeDoeDoeDoeDoeDoeDoeDoeDoeDoeDoeDoe',
//         },
//       };

//       await expect(userService.createUser(invalidUserDto)).rejects.toThrowError(
//         ConflictException,
//       );
//     });

//     it('should throw ConflictException for invalid email format', async () => {
//       const invalidUserDto = {
//         ...mockUserDto,
//         contact_info: {
//           ...mockUserDto.contact_info,
//           email: 'abc..@@@.gmail@@.com',
//         },
//       };

//       await expect(userService.createUser(invalidUserDto)).rejects.toThrowError(
//         ConflictException,
//       );
//     });

//     it('should throw a ConflictException for duplicate mobile numbers', async () => {
//       // Mock createUserDto with duplicate mobile numbers
//       const duplicateMobileNumbersDto = {
//         type: 'ADMIN',
//         status: 'ACTIVE',
//         basic_info: {
//           first_name: 'John',
//           last_name: 'Doe',
//           dob: new Date('1995-04-23'),
//           gender: 'MALE',
//         },
//         contact_info: {
//           mobile_numbers: ['222', '222'], // Duplicate mobile numbers
//           email: 'test@example.com',
//         },
//         auth_info: {
//           password: '12345',
//         },
//       };

//       await expect(
//         userService.createUser(duplicateMobileNumbersDto),
//       ).rejects.toThrowError(ConflictException);
//     });


//     it('should throw ConflictException for invalid length of email', async () => {
//       const createUserDto = {
//         ...mockUserDto,
//         contact_info: {
//           ...mockUserDto.contact_info,
//           email: 'a'.repeat(321) + '@example.com', 
//         },
//       };

//       await expect(userService.createUser(createUserDto)).rejects.toThrowError(
//         ConflictException,
//       );
//     });
//   });

//   describe('deactivateUser', () => {
//     it('should deactivate an ACTIVE user', async () => {
//       const email = 'active@example.com';
//       const status = 'ACTIVE';
//       const activeUser = { ...mockUserDto, status, contact_info: { email } };
//       jest.spyOn(mockUserModel, 'findOne').mockReturnValueOnce({
//         exec: jest.fn().mockResolvedValueOnce(User),
//       });

//       // Create a deactivated user object
//       const deactivatedUserDto = { ...mockUserDto, status: 'INACTIVE' };

//       jest.spyOn(mockUserModel, 'findOneAndUpdate').mockReturnValueOnce({
//         exec: jest.fn().mockResolvedValueOnce(deactivatedUserDto),
//       });

//       const deactivatedUser = await userService.deactivateUser(email);
//       expect(deactivatedUser.status).toBe('INACTIVE');
//     });

//     it('should throw NotFoundException when attempting to deactivate an INACTIVE user', async () => {
//       const email = 'inactive@example.com';
//       mockUserModel.findOne.mockReturnValueOnce({
//         exec: jest.fn().mockResolvedValueOnce(null),
//       });

//       await expect(userService.deactivateUser(email)).rejects.toThrowError(
//         NotFoundException,
//       );
//     });
//   });

//   describe('updateUserByEmail', () => {
//     it('should update user with valid email and data', async () => {
//       const email = 'au6769hj@gmail.com';
//       const updatedUser = {
//         ...mockUserDto,
//         basic_info: { ...mockUserDto.basic_info, first_name: 'John Updated' },
//       };

//       jest.spyOn(mockUserModel, 'findOneAndUpdate').mockReturnValueOnce({
//         exec: jest.fn().mockResolvedValueOnce(updatedUser),
//       } as any);

//       const result = await userService.updateUserByEmail(email, updatedUser);

//       expect(result).toEqual(updatedUser);
//     });

//     it('should throw NotFoundException if user not found', async () => {
//       const email = 'unknown@example.com';
//       const updatedUser = {
//         ...mockUserDto,
//         basic_info: { ...mockUserDto.basic_info, first_name: 'John Updated' },
//       };

//       jest.spyOn(mockUserModel, 'findOneAndUpdate').mockReturnValueOnce({
//         exec: jest.fn().mockResolvedValueOnce(null),
//       } as any);

//       await expect(
//         userService.updateUserByEmail(email, updatedUser),
//       ).rejects.toThrowError(NotFoundException);
//     });

//     it('should throw ConflictException for invalid length of first name', async () => {
//       const email = 'au6769hj@gmail.com';
//       const updatedUser = {
//         ...mockUserDto,
//         basic_info: {
//           ...mockUserDto.basic_info,
//           first_name: 'JohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohn',
//         },
//       };

//       jest.spyOn(mockUserModel, 'findOneAndUpdate').mockReturnValueOnce({
//         exec: jest.fn().mockResolvedValueOnce(User),
//       });

//       await expect(
//         userService.updateUserByEmail(email, updatedUser),
//       ).rejects.toThrowError(ConflictException);
//     });

//     it('should throw ConflictException for invalid length of last name', async () => {
//       const email = 'au6769hj@gmail.com';
//       const updatedUser = {
//         ...mockUserDto,
//         basic_info: {
//           ...mockUserDto.basic_info,
//           first_name: 'JohnJohnJohnJ',
//           last_name: 'DoeDoeDoeDoeDoeDoeDoeDoeDoeDoeDoeDoeDoeDoeDoeDoeDoeDoe',
//         },
//       };

//       jest.spyOn(mockUserModel, 'findOneAndUpdate').mockReturnValueOnce({
//         exec: jest.fn().mockResolvedValueOnce(User),
//       });

//       await expect(
//         userService.updateUserByEmail(email, updatedUser),
//       ).rejects.toThrowError(ConflictException);
//     });

//     it('should throw ConflictException if mobile numbers count exceeds limit', async () => {
//       const email = 'au6769hj@gmail.com';
//       const updatedUser = {
//         ...mockUserDto,
//         contact_info: {
//           ...mockUserDto.contact_info,
//           mobile_numbers: ['06687676', '5477896', '4352346', '9876543'],
//         },
//       };

//       jest.spyOn(mockUserModel, 'findOneAndUpdate').mockReturnValueOnce({
//         exec: jest.fn().mockResolvedValueOnce(User),
//       });

//       await expect(
//         userService.updateUserByEmail(email, updatedUser),
//       ).rejects.toThrowError(ConflictException);
//     });

//     it('should throw ConflictException if email format is invalid', async () => {
//       const email = 'au6769hj@gmail.com';
//       const updatedUser = {
//         ...mockUserDto,
//         contact_info: {
//           ...mockUserDto.contact_info,
//           email: 'zzz@@@gmail@@.@com',
//         },
//       };

//       jest.spyOn(mockUserModel, 'findOneAndUpdate').mockReturnValueOnce({
//         exec: jest.fn().mockResolvedValueOnce(User),
//       });
//       await expect(
//         userService.updateUserByEmail(email, updatedUser),
//       ).rejects.toThrowError(ConflictException);
//     });

    
//     it('should update user profile without duplicate mobile numbers', async () => {
//       const email = 'test@example.com';
//       const updatedMobileNumbers = ['222', '222']; // Duplicate mobile numbers
//       const updatedUser = {
//         ...mockUserDto,
//         contact_info: {
//           ...mockUserDto.contact_info,
//           mobile_numbers: updatedMobileNumbers,
//         },
//       };

//       // Simulate an existing user with a different mobile number
//       jest.spyOn(mockUserModel, 'findOne').mockReturnValueOnce({
//         exec: jest.fn().mockResolvedValueOnce(mockUserDto as any),
//       });

//       // Mock successful update
//       jest.spyOn(mockUserModel, 'findOneAndUpdate').mockReturnValueOnce({
//         exec: jest.fn().mockResolvedValueOnce(updatedUser as any),
//       });

//       // Perform the update operation
//       const result = await userService.updateUserByEmail(email, updatedUser);

//       // Verify that the update is successful
//       expect(result).toEqual(updatedUser);
//     });

//     it('should update user profile with unique email and mobile numbers', async () => {
//       const email = 'test@example.com';
//       const updatedUser = {
//         ...mockUserDto,
//         contact_info: {
//           ...mockUserDto.contact_info,
//           email: 'updated@example.com',
//         },
//       };

//       // Simulate no user with the updated email
//       jest.spyOn(mockUserModel, 'findOne').mockReturnValueOnce({
//         exec: jest.fn().mockResolvedValueOnce(null),
//       });

//       // Simulate no user with any of the updated mobile numbers
//       for (const mobileNumber of updatedUser.contact_info.mobile_numbers) {
//         jest.spyOn(mockUserModel, 'findOne').mockReturnValueOnce({
//           exec: jest.fn().mockResolvedValueOnce(null),
//         });
//       }

//       // Mock successful update
//       jest.spyOn(mockUserModel, 'findOneAndUpdate').mockReturnValueOnce({
//         exec: jest.fn().mockResolvedValueOnce(updatedUser as any),
//       });

//       // Perform the update operation
//       const result = await userService.updateUserByEmail(email, updatedUser);

//       // Verify that the update is successful
//       expect(result).toEqual(updatedUser);
//     });

    
//       it('should throw ConflictException for invalid length of email', async () => {
//         const email = 'test@example.com';
//         const updateUserDto = {
//           ...mockUserDto,
//           contact_info: {
//             ...mockUserDto.contact_info,
//             email: 'a'.repeat(321) + '@example.com', // 321 characters long, exceeding the limit
//           },
//         };
  
//         await expect(userService.updateUserByEmail(email, updateUserDto)).rejects.toThrowError(
//           ConflictException,
//         );
//       });

  

//     describe('updateUserByEmail', () => {
//       it('should send a deactivation email to the user', async () => {
//         // Mock user data
//         const email = 'test@example.com';
//         const user = {
//           basic_info: {
//             first_name: 'John',
//           },
//           contact_info: {
//             email,
//           },
//           status: 'ACTIVE',
//         };

//         jest.spyOn(mockUserModel, 'findOne').mockReturnValueOnce({
//           exec: jest.fn().mockResolvedValueOnce(user as any),
//         });

//         jest.spyOn(mockUserModel, 'findOneAndUpdate').mockReturnValueOnce({
//           exec: jest.fn().mockResolvedValueOnce(user as any),
//         });

//         await userService.deactivateUser(email);

//         expect(mockMailerService.sendMail).toHaveBeenCalledTimes(1);

//         expect(mockMailerService.sendMail).toHaveBeenCalledWith({
//           to: email,
//           subject: 'Test Mail',
//           template: 'test',
//           context: {
//             firstname: user.basic_info.first_name,
//           },
//         });
//       });
//     });
//   });
// });
