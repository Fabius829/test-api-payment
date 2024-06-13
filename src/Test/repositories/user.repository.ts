import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    protected userRepository: Repository<User>,
  ) {}

  async createUser(newUser: User): Promise<User> {
    const createdUser = await this.userRepository.save(newUser);

    return createdUser;
  }
  async deleteUser(id: string): Promise<boolean> {
    const deletedUser = await this.userRepository.delete(id);
    return (
      deletedUser.affected !== null &&
      deletedUser.affected !== undefined &&
      deletedUser.affected > 0
    );
  }
}
