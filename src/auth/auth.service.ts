import * as bcrypt from 'bcryptjs';
import { default as config } from '../config';
import {
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MailService } from './mail.service';
import { JWTService } from './jwt.service';
import { User } from '../users/interfaces/user.interface';
import { LoginDto } from '../users/dto/user.dto';
import * as Mustache from 'mustache';
import * as fs from 'fs';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly jwtService: JWTService,
    private readonly mailService: MailService,
  ) {}

  async validateLogin(email, password, isAdmin = false) {
    const userFromDb = await this.userModel.findOne({ email });

    if (!userFromDb)
      throw new HttpException('LOGIN.USER_NOT_FOUND', HttpStatus.NOT_FOUND);

    const isValidPass = await bcrypt.compare(password, userFromDb.password);

    if (isAdmin && userFromDb.role !== 'admin') {
      throw new HttpException('LOGIN.USER_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    if (isValidPass) {
      const accessToken = await this.jwtService.createToken(
        email,
      );
      const cleanUser = new LoginDto(userFromDb);
      return { token: accessToken, user: cleanUser };
    } else {
      throw new HttpException('LOGIN.ERROR', HttpStatus.UNAUTHORIZED);
    }
  }

  async getAccessToken(id) {
    const userFromDb = await this.userModel.findById(id);

    if (userFromDb) {
      const accessToken = await this.jwtService.createToken(
        userFromDb.email,
      );
      const cleanUser = new LoginDto(userFromDb);
      return { token: accessToken, user: cleanUser };
    } else {
      throw new HttpException('SIGNUP.ERROR', HttpStatus.UNAUTHORIZED);
    }
  }

  async checkPassword(email: string, password: string) {
    const userFromDb = await this.userModel.findOne({ email });
    if (!userFromDb)
      throw new HttpException('LOGIN.USER_NOT_FOUND', HttpStatus.NOT_FOUND);

    return await bcrypt.compare(password, userFromDb.password);
  }
}
