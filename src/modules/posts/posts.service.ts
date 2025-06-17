import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  create(dto: CreatePostDto) {
    const post = this.postRepository.create(dto);
    return this.postRepository.save(post);
  }

  findOne(id: string) {
    return this.postRepository.findOneBy({ id });
  }

  update(id: string, dto: UpdatePostDto) {
    return this.postRepository.update(id, dto);
  }

  remove(id: string) {
    return this.postRepository.delete(id);
  }

  async findAll(page: number, limit: number) {
    const [items, total] = await this.postRepository.findAndCount({
      order: { createdAt: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });

    return {
      items,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }
}
