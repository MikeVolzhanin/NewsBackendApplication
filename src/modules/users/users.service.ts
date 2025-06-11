import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  create(dto: CreateUserDto) {
    const user = this.userRepository.create(dto);
    return this.userRepository.save(user);
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  findByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  update(id: number, dto: UpdateUserDto) {
    return this.userRepository.update(id, dto);
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }

  async createWithHashedPassword(dto: CreateUserDto) {
  const existing = await this.userRepository.findOneBy({ email: dto.email });
  if (existing) {
    throw new Error('User with this email already exists');
  }

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(dto.password, salt);

  const user = this.userRepository.create({
    ...dto,
    password: hashedPassword,
  });

  return this.userRepository.save(user);
  }
}
