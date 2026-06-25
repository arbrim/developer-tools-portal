import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { UserRole } from './user-role.enum';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

  findByEmail(email: string) {
    return this.userModel.findOne({ email: email.toLowerCase() }).exec();
  }

  findById(id: string) {
    return this.userModel.findById(id).exec();
  }

  async ensureUser(input: { name: string; email: string; passwordHash: string; role: UserRole }) {
    const existing = await this.findByEmail(input.email);
    if (existing) {
      return existing;
    }

    return this.userModel.create(input);
  }
}
