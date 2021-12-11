import { Connection, Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { HttpException, HttpStatus, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { User } from './interfaces/user.interface';
import { UserDto } from './dto/user.dto';
var otpGenerator = require('otp-generator')

const saltRounds = 10;

const defaultUsers = [{
  firstName: 'Noname',
  lastName: 'Noname',
  email: 'noname@noname.com',
  password: 'nonamenoname!',
  role: 'user',
}, {
  isTest: true,
  firstName: 'Provider',
  lastName: 'Test User (Not use)',
  email: 'provider@test-user.com',
  password: 'nonamenoname!',
  role: 'user',
}, {
  isTest: true,
  firstName: 'Client',
  lastName: 'Test User (Not use)',
  email: 'client@test-user.com',
  password: 'nonamenoname!',
  role: 'user',
}];

@Injectable()
export class UsersService implements OnApplicationBootstrap {
  async onApplicationBootstrap() {
    await (async () => {
      for (const defaultUser of defaultUsers) {
        const defaultUserExist = await this.userModel.exists({
          email: defaultUser.email,
        });

        if (!defaultUserExist) {
          const createdUser = await this.createNewUser(new UserDto(defaultUser));
          await createdUser.save();
        }
      }
    })();
  }
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userModel.find().exec();
  }

  async findByEmail(email: string): Promise<User> {
    return await this.userModel.findOne({ email }).exec();
  }

  isValidEmail(email: string) {
    if (email) {
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    } else return false;
  }

  async createNewUser(newUser: UserDto, isAdmin = false): Promise<User> {
    if (this.isValidEmail(newUser.email.toLowerCase()) && newUser.password) {
      const userRegistered = await this.findByEmail(newUser.email.toLowerCase());
      if (!userRegistered) {
        const otpcode = otpGenerator.generate(6, { upperCase: false, specialChars: false });
        const tempNewUser = {
          ...newUser, verified: false, role: isAdmin ? 'admin' : 'user'
        };

        tempNewUser.password = await bcrypt.hash(newUser.password, saltRounds);
        const createdUser = new this.userModel(tempNewUser);
        return await createdUser.save();
      } else {
        throw new HttpException(
          'REGISTRATION.USER_ALREADY_REGISTERED',
          HttpStatus.FORBIDDEN,
        );
      }
    } else {
      throw new HttpException(
        'REGISTRATION.MISSING_MANDATORY_PARAMETERS',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async checkPassword(userId: string, password: string) {
    const userFromDb = await this.userModel.findById(userId);
    if (!userFromDb)
      throw new HttpException('COMMON.USER_NOT_FOUND', HttpStatus.NOT_FOUND);

    return await bcrypt.compare(password, userFromDb.password);
  }
  async setPasswordByUserId(userId: string, newPassword: string): Promise<boolean> {
    const userFromDb = await this.userModel.findById(userId );
    if (!userFromDb)
      throw new HttpException('COMMON.USER_NOT_FOUND', HttpStatus.NOT_FOUND);

    userFromDb.password = await bcrypt.hash(newPassword, saltRounds);

    await userFromDb.save();
    return true;
  }
}
