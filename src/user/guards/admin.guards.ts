// import {
//     CanActivate,
//     ExecutionContext,
//     Injectable,
//     UnauthorizedException,
//   } from '@nestjs/common';
//   import { JwtService } from '@nestjs/jwt';
//   import { Request } from 'express';
//   import userTypes from 'src/constants/user_types';
  
//   @Injectable()
//   export class AdminGuard implements CanActivate {
//     constructor(private jwtService: JwtService) {}
  
//     async canActivate(context: ExecutionContext): Promise<boolean> {
//       const request = context.switchToHttp().getRequest();
//       const token = request.headers['authorization'];
//       if (!token) {
//         throw new UnauthorizedException();
//       }
//       const verified = this.jwtService.verify(token);
//       if(verified?.type !== userTypes.admin){ 
//         throw new UnauthorizedException();
//       }

//       request.auth = verified;
//       return true;
//     }
    
// }

// import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';

// @Injectable()
// export class AuthGuard implements CanActivate {
//   constructor(private jwtService: JwtService) {}

//   canActivate(context: ExecutionContext): boolean {
//     const request = context.switchToHttp().getRequest();
//     const token = request.headers['authorization'];
//     if (!token) {
//       throw new UnauthorizedException('Authorization token is missing');
//     }
//     try {
//       const decoded = this.jwtService.verify(token.split(' ')[1]);
//       if (!decoded || !decoded.userId) {
//         throw new UnauthorizedException('Invalid token');
//       }
//       return true;
//     } catch (error) {
//       throw new UnauthorizedException('Invalid token');
//     }
//   }
// }


import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import userTypes from '../../constants/user_types';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization'];
    console.log("Token- ",token)
    if(!token){
      throw new UnauthorizedException();
    }
    const verified = this.jwtService.verify(token)
    if(verified?.type !== userTypes.admin){
      throw new UnauthorizedException();
    }
    request.auth = verified;
    return true;
  }
}