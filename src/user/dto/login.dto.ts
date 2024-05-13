import { IsString, IsNotEmpty, IsEmail, IsEnum } from 'class-validator'; 
import { Transform } from 'class-transformer'; 

export default class UserLoginDto {

     @Transform(({ value }) => value.trim()) 
     @IsEmail() 
     @IsNotEmpty() 
    email: string; 
     
     @Transform(({ value }) => value.trim()) 
     @IsString() 
     @IsNotEmpty() 
     password: string; 

}
