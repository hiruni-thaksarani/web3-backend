class BasicInfoDto{
    first_name: string;
    last_name: string;
    dob: Date;
    gender: string;
}

// class ContactInfoDto{
//     mobile_number: string;
//     email: string; 

// }

class ContactInfoDto {
    mobile_numbers: string[]; 
    email:string;

    constructor(mobile_numbers: string[], email: string) {
        this.mobile_numbers = mobile_numbers;
        this.email = email;
    }
}


class AuthInfoDto{
    password: string;
}

export default class GetUsersDto {
    type: string;
    status: string;
    basic_info:BasicInfoDto;
    contact_info:ContactInfoDto;
    auth_info:AuthInfoDto;
}


