import { IsString, IsNotEmpty, IsEmail, IsEnum, registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { Transform } from 'class-transformer';

class basic_info {
    @Transform(({ value }) => value.trim())
    @IsString()
    @IsNotEmpty()
    first_name: string;

    @Transform(({ value }) => value.trim())
    @IsString()
    @IsNotEmpty()
    last_name: string;

    dob: Date;

    @Transform(({ value }) => value.trim())
    @IsEnum(['MALE', 'FEMALE'])
    @IsNotEmpty()
    gender: string;
}

// class contact_info {
//     @Transform(({ value }) => value.trim())
//     @IsEmail()
//     @IsNotEmpty()
//     email: string;

//     @Transform(({ value }) => value.trim())
//     @IsString()
//     @IsNotEmpty()
//     mobile_number: string;
// }

class contact_info {
    @Transform(({ value }) => value.trim())
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @Transform(({ value }) => value.trim())
    @IsString()
    @IsNotEmpty()
    mobile_numbers: string[]; // Changed to an array of strings for multiple mobile numbers

    constructor(email: string, mobile_numbers: string[]) {
        this.email = email;
        this.mobile_numbers = mobile_numbers;
    }
}

class auth_info {
    @Transform(({ value }) => value.trim())
    @IsString()
    @IsNotEmpty()
    password: string;
}

export default class updateUserDto{
    @Transform(({ value }) => value.trim())
    @IsString()
    @IsNotEmpty()
    type: string;

    @Transform(({ value }) => value.trim())
    @IsString()
    @IsNotEmpty()
    status: string;

    basic_info: basic_info;
    contact_info: contact_info;
    auth_info: auth_info;
}
