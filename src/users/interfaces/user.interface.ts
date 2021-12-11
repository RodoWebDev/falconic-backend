import { Document } from 'mongoose';

export class User extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  auth: {
    email: {
      valid: boolean;
    };
    facebook?: {
      userid: string;
    };
    gmail?: {
      userid: string;
    };
  };
}
